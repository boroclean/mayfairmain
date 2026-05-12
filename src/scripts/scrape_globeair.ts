import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

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
        const { data: existing, error: dbError } = await supabase
          .from('empty_legs')
          .select('id, base_price, departure_time')
          .eq('external_id', flight.externalId)
          .maybeSingle();

        if (existing) {
          if (existing.base_price === flight.basePrice && existing.departure_time === flight.departureTime) {
            console.log(`Skipping ${flight.externalId} - Price and time perfectly match.`);
            continue; 
          } else {
            console.log(`Price/Time changed for ${flight.externalId}! Updating...`);
          }
        } else {
          console.log(`New flight found: ${flight.externalId}`);
        }

        const price = flight.basePrice;
        const brokerFee = price * 0.10;
        const finalBrokerFee = Math.ceil(brokerFee / 10) * 10;
        const finalTotal = price + finalBrokerFee;

        console.log(`GlobeAir Price: €${price} | Broker Fee: €${finalBrokerFee} | Final Total: €${finalTotal}`);

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
            broker_fee: finalBrokerFee
          }]);
        } else {
          console.log('Updating existing flight...');
          await supabase.from('empty_legs').update({
            base_price: flight.basePrice,
            net_price: price,
            broker_fee: finalBrokerFee,
            departure_date: flight.isoDate,
            departure_time: flight.departureTime,
            aircraft_model: 'Cessna Citation Mustang'
          }).eq('id', existing.id);
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
