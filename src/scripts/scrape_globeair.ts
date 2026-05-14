import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const ACTIVITY_LOG_PATH = 'SCRAPER_ACTIVITY.md';

function logActivity(action: string, details: string) {
  const timestamp = new Date().toISOString();
  const logLine = `| ${timestamp} | ${action} | ${details} |\n`;
  
  if (!fs.existsSync(ACTIVITY_LOG_PATH)) {
    fs.writeFileSync(ACTIVITY_LOG_PATH, '# Scraper Activity Log\n\n| Timestamp | Action | Details |\n| --- | --- | --- |\n');
  }
  
  fs.appendFileSync(ACTIVITY_LOG_PATH, logLine);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function scrapeGlobeAir() {
  console.log('Starting GlobeAir scraper...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();

  try {
    // Check if we need to login
    await page.goto('https://fly.globeair.com/en/users/login', { waitUntil: 'networkidle' });
    
    if (page.url().includes('login')) {
      console.log('Logging in to GlobeAir automatically...');
      try {
        const acceptButton = await page.$('button:has-text("Accept"), button:has-text("Allow"), .cc-allow');
        if (acceptButton) {
          await acceptButton.click();
          console.log('Accepted cookies.');
        }
      } catch (e) {
        // Banner not found, that's fine
      }

      await page.fill('#auth_userid', process.env.GLOBEAIR_EMAIL!);
      await page.fill('#auth_password', process.env.GLOBEAIR_PASSWORD!);
      await page.click('button[title="Login"], .btn-primary[title="Login"]'); 
      await page.waitForTimeout(4000); // Wait for login redirect
    }

    console.log('Navigating to GlobeAir empty legs page...');
    await page.goto('https://www.globeair.com/empty-leg-flights', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const flightsToProcess = await page.$$eval('a[href^="https://fly.globeair.com/el/"]:not(.button)', links => {
      const flights: any[] = [];
      const seenIds = new Set();
      
      links.forEach(link => {
        const href = (link as HTMLAnchorElement).href;
        const externalId = href.split('/').pop() || '';
        
        if (seenIds.has(externalId)) return;
        seenIds.add(externalId);
        
        let basePrice = 0;
        let departureTime = 'TBD';
        let isoDate = '';
        let depAirport = '';
        let destAirport = '';
        
        const routingText = link.textContent || '';
        const parts = routingText.split('→');
        if (parts.length === 2) {
          depAirport = parts[0].trim();
          destAirport = parts[1].trim();
          
          // Map Lugano to Milan as requested by user
          if (destAirport.includes('Lugano (LUG)')) {
            destAirport = 'Milan (MXP)';
          }
        }
        
        const flightDataEl = link.nextElementSibling;
        if (flightDataEl && flightDataEl.classList.contains('flightdata')) {
          const html = flightDataEl.innerHTML;
          const lines = html.split('<br>').map(l => l.replace(/<[^>]*>?/gm, '').trim());
          
          if (lines.length > 0) {
            const rawDate = lines[0]; // e.g. "May 13, 2026"
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              isoDate = `${yyyy}-${mm}-${dd}`;
            }
          }
          
          if (lines.length > 1) {
            const timeString = lines[1]; // e.g. "10:40 AM → 12:11 PM"
            const timeParts = timeString.split('→');
            
            if (timeParts.length >= 1) {
              const rawDep = timeParts[0].trim();
              const matchDep = rawDep.match(/(\d+):(\d+)\s*(AM|PM)/i);
              let depTime = rawDep;
              if (matchDep) {
                let hours = parseInt(matchDep[1], 10);
                const mins = matchDep[2];
                const modifier = matchDep[3].toUpperCase();
                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                depTime = `${hours.toString().padStart(2, '0')}:${mins}`;
              }
              
              departureTime = depTime;
              
              if (timeParts.length >= 2) {
                const rawArr = timeParts[1].trim();
                const matchArr = rawArr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                let arrTime = rawArr;
                if (matchArr) {
                  let hours = parseInt(matchArr[1], 10);
                  const mins = matchArr[2];
                  const modifier = matchArr[3].toUpperCase();
                  if (modifier === 'PM' && hours < 12) hours += 12;
                  if (modifier === 'AM' && hours === 12) hours = 0;
                  arrTime = `${hours.toString().padStart(2, '0')}:${mins}`;
                }
                departureTime = `${depTime} - ${arrTime}`;
              }
            }
          }
          
          const text = flightDataEl.textContent || '';
          const priceMatch = text.match(/Book for €([\d,.]+)/i);
          if (priceMatch) {
            basePrice = parseFloat(priceMatch[1].replace(',', ''));
          } else {
            const fallbackMatch = text.match(/€([\d,.]+)/);
            if (fallbackMatch) basePrice = parseFloat(fallbackMatch[1].replace(',', ''));
          }
        }
        
        if (basePrice > 0 && isoDate) {
          flights.push({ href, externalId, basePrice, departureTime, isoDate, depAirport, destAirport });
        }
      });
      return flights;
    });

    console.log(`Found ${flightsToProcess.length} valid flights to process.`);

    for (const flight of flightsToProcess) {
      try {
        const { data: existingRows, error: dbError } = await supabase
          .from('empty_legs')
          .select('id, base_price, departure_time')
          .eq('external_id', flight.externalId)
          .limit(1);

        const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

        if (existing) {
          if (existing.base_price === flight.basePrice && existing.departure_time === flight.departureTime) {
            console.log(`Checking ${flight.externalId} anyway to ensure VAT and price are correct...`);
            // continue; // Do NOT skip, we need to check the flight page for VAT!
          } else {
            console.log(`Price/Time changed for ${flight.externalId}! Updating...`);
          }
        } else {
          console.log(`New flight found: ${flight.externalId}`);
        }

        // Navigate to the flight page to check for VAT and ensure 4 passengers
        let vatAmount = 0;
        let price = flight.basePrice;
        try {
          console.log(`Navigating to flight page: ${flight.href}`);
          await page.goto(flight.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForTimeout(5000); // Wait longer for VAT and price updates!
          
          // Handle the "For how many passengers?" page if it appears
          const isPaxPage = await page.$('text="For how many passengers?"');
          if (isPaxPage) {
            console.log("On passenger selection page. Clicking '4 passengers'...");
            await page.click('text="4 passengers"');
            await page.waitForTimeout(5000); // Wait for confirmation page to load
          } else {
            // Check for passenger selection buttons (Case B)
            const paxButtonSelector = "a.btn.btn-primary[href*='pax=4']";
            const hasPaxButton = await page.$(paxButtonSelector);
            
            if (hasPaxButton) {
              console.log("Found passenger selection buttons. Clicking '4 passengers'...");
              await page.click(paxButtonSelector);
              await page.waitForTimeout(3000); // Wait for redirect to confirm page
            } else {
              // Fallback: check for dropdown if it's a different layout
              const paxSelector = 'select[name="trip[legs][0][pax_count]"]';
              const hasPaxSelector = await page.$(paxSelector);
              if (hasPaxSelector) {
                console.log("Found passenger dropdown. Setting to 4...");
                await page.selectOption(paxSelector, '4');
                await page.waitForTimeout(2000); // Wait for price to update
              }
            }
          }
          
          const bodyText = await page.innerText('body');
          
          // Debug screenshot to see what the scraper sees
          await page.screenshot({ path: `debug_flight_${flight.externalId}.png` });
          console.log(`Saved debug screenshot for ${flight.externalId}`);
          
          // Extract time from flight page if available (e.g. "at 13:00")
          const timeMatch = bodyText.match(/at\s*(\d{2}:\d{2})/i);
          if (timeMatch) {
            const depTime = timeMatch[1];
            console.log(`Extracted time from flight page: ${depTime}`);
            // Update the departure time with the one from the booking page!
            // We keep the arrival time if we had it, or just use the new departure time
            if (flight.departureTime.includes('-')) {
              const parts = flight.departureTime.split('-');
              flight.departureTime = `${depTime} - ${parts[1].trim()}`;
            } else {
              flight.departureTime = depTime;
            }
          }
          
          // Find all prices on the page
          const prices = bodyText.match(/€\s*([\d,.]+)/g);
          
          // Find the highest price on the flight page (which is for 4 passengers)
          let highestPrice = price; // Default to list price
          if (prices) {
            for (const p of prices) {
              const val = parseFloat(p.replace('€', '').trim().replace(',', ''));
              if (val > highestPrice) {
                highestPrice = val;
              }
            }
          }
          
          // Check for VAT
          const hasVat = bodyText.match(/(VAT|TVA)\s*\d+%/i) || 
                         bodyText.match(/\d+%\s*(VAT|TVA)/i) ||
                         bodyText.match(/\(VAT.*?included\)/i) ||
                         bodyText.match(/VAT.*?€/i);
                         
          if (hasVat) {
            console.log(`VAT detected on flight page! Highest Price: €${highestPrice}`);
            // Calculate price without VAT (assuming 10% as per user request)
            const priceWithoutVat = Math.round(highestPrice / 1.1);
            vatAmount = Math.round(highestPrice - priceWithoutVat);
            price = priceWithoutVat; // Use price without VAT
            console.log(`Calculated: Price without VAT: €${price} | VAT: €${vatAmount}`);
          } else {
            price = highestPrice; // No VAT, use highest price
          }
        } catch (navError) {
          console.error(`Failed to navigate to flight page:`, navError);
        }
        const brokerFee = price * 0.10;
        const finalBrokerFee = Math.ceil(brokerFee / 10) * 10;
        const finalTotal = price + finalBrokerFee;

        console.log(`GlobeAir Price: €${price} | VAT: €${vatAmount} | Broker Fee: €${finalBrokerFee}`);

          if (!existing) {
            console.log('Inserting new flight...');
            await supabase.from('empty_legs').insert([{
              external_id: flight.externalId,
              base_price: flight.basePrice,
              departure_airport: flight.depAirport,
              destination_airport: flight.destAirport,
              departure_date: flight.isoDate,
              departure_time: flight.departureTime,
              aircraft_model: 'Cessna Citation Mustang',
              aircraft_category: 'Very Light Jet',
              seats: 4,
              net_price: price,
              broker_fee: finalBrokerFee,
              vat_amount: vatAmount
            }]);
            logActivity('INSERT', `Flight ${flight.externalId} from ${flight.depAirport} to ${flight.destAirport} for €${finalTotal}`);
          } else {
             console.log('Updating existing flight...');
             const { error: updateError } = await supabase.from('empty_legs').update({
               base_price: flight.basePrice,
               net_price: price,
               broker_fee: finalBrokerFee,
               vat_amount: vatAmount,
               departure_date: flight.isoDate,
               departure_time: flight.departureTime,
               aircraft_model: 'Cessna Citation Mustang'
             }).eq('id', existing.id);
             
             if (updateError) {
               console.error(`Failed to update flight ${flight.externalId}:`, updateError);
             } else {
               logActivity('UPDATE', `Flight ${flight.externalId} updated price to €${finalTotal} and time to ${flight.departureTime}`);
             }
          }
      } catch (error) {
        console.error(`Error processing flight ${flight.externalId}:`, error);
      }
    }

    console.log('Checking for flights that are no longer available on GlobeAir...');
    const currentExternalIds = flightsToProcess.map(f => f.externalId);
    
    if (currentExternalIds.length > 0) {
      const { data: dbFlights } = await supabase
        .from('empty_legs')
        .select('id, external_id')
        .not('external_id', 'is', null);

      if (dbFlights) {
        for (const dbFlight of dbFlights) {
          if (!currentExternalIds.includes(dbFlight.external_id)) {
            console.log(`Flight ${dbFlight.external_id} is no longer on GlobeAir. Removing from our database...`);
            await supabase.from('empty_legs').delete().eq('id', dbFlight.id);
            logActivity('DELETE', `Flight ${dbFlight.external_id} removed because it is no longer on GlobeAir`);
          }
        }
      }
    }

    console.log('Cleanup complete!');

  } catch (error) {
    console.error('Fatal error during scraping:', error);
  } finally {
    console.log('Scraper finished.');
    await browser.close();
  }
}

// Allow running directly
if (require.main === module) {
  scrapeGlobeAir().catch(console.error).finally(() => process.exit(0));
}

export { scrapeGlobeAir };
