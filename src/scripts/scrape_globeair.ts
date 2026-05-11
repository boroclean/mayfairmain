import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeGlobeAir() {
  console.log('Starting GlobeAir scraper...');
  
  const browser = await chromium.launch({ 
    headless: true,
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  try {
    console.log('Navigating to GlobeAir empty legs page...');
    await page.goto('https://www.globeair.com/empty-leg-flights', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const flightLinks = await page.$$eval('a[href^="https://fly.globeair.com/el/"]', links => 
      links.map(a => (a as HTMLAnchorElement).href)
    );

    console.log(`Found ${flightLinks.length} flight links.`);

    for (const link of flightLinks) {
      try {
        console.log(`Processing flight: ${link}`);
        await page.goto(link, { waitUntil: 'networkidle' });
        
        // Wait for the passenger button to appear (handles redirect)
        try {
          await page.waitForSelector('a[href*="pax=4"]', { timeout: 10000 });
        } catch (e) {
          console.log('Passenger button not found or timed out. Skipping.');
          continue;
        }

        const passengerButton = await page.$('a[href*="pax=4"]');
        
        if (passengerButton) {
          console.log('Selecting 4 passengers...');
          await passengerButton.click();
          await page.waitForTimeout(2000);
          
          // Click submit to go to confirmation page
          const submitButton = await page.$('button#astro-booking-submit');
          if (submitButton) {
            await submitButton.click();
            await page.waitForTimeout(2000);
          }
        }

        // Read the final price on the confirmation page
        const priceElement = await page.$('span.f3x.font-weight-bold');
        const priceText = priceElement ? await priceElement.innerText() : '';
        
        const priceMatch = priceText.match(/[\d,.]+/);
        const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : 0;

        console.log(`Final Price for 4 passengers: €${price}`);

        // TODO: Save to Supabase
        // You will need to map the flight details (Routing, Date) here
        // and insert them into your Supabase table.

      } catch (error) {
        console.error(`Error processing flight ${link}:`, error);
      }
      
      await page.waitForTimeout(5000);
    }

  } catch (error) {
    console.error('Scraper failed:', error);
  } finally {
    await browser.close();
    console.log('Scraper finished.');
  }
}

scrapeGlobeAir();
