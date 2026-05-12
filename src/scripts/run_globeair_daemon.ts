import { execSync } from 'child_process';

// Calculate 1 hour in milliseconds
const INTERVAL_MS = 1 * 60 * 60 * 1000;

function runScraper() {
  console.log(`\n=================================================`);
  console.log(`🕒 [${new Date().toLocaleString()}] Starting scheduled GlobeAir scraper...`);
  console.log(`=================================================\n`);
  
  try {
    // Execute the scraper as a child process
    execSync('node --env-file=.env.local --import tsx src/scripts/scrape_globeair.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\n❌ Scheduled scraper encountered an error:', error);
  }
  
  console.log(`\n=================================================`);
  console.log(`✅ [${new Date().toLocaleString()}] Scraper run complete!`);
  console.log(`⏳ Next run is scheduled in 1 hour.`);
  console.log(`=================================================\n`);
}

// Run the first time immediately
runScraper();

// Then run every 4 hours automatically
setInterval(runScraper, INTERVAL_MS);
