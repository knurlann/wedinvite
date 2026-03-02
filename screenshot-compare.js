const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone size
    deviceScaleFactor: 2,
  });

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Site 1: Tilda
  console.log('Capturing Tilda site...');
  const page1 = await context.newPage();
  await page1.goto('https://toigashakyru20.tilda.ws/design-14', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  // Wait for page to fully load
  await page1.waitForTimeout(3000);
  
  // Get full page height
  const tildaHeight = await page1.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Tilda page height: ${tildaHeight}px`);
  
  // Take full page screenshot
  await page1.screenshot({ 
    path: path.join(screenshotsDir, 'tilda-full.png'),
    fullPage: true
  });
  
  // Take screenshots at different scroll positions
  const scrollPositions = [0, 800, 1600, 2400, 3200, 4000, 4800];
  
  for (let i = 0; i < scrollPositions.length; i++) {
    const scrollY = scrollPositions[i];
    if (scrollY > tildaHeight) break;
    
    await page1.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page1.waitForTimeout(1000); // Wait for any animations
    
    await page1.screenshot({
      path: path.join(screenshotsDir, `tilda-section-${i + 1}-${scrollY}px.png`)
    });
    console.log(`Tilda section ${i + 1} captured at ${scrollY}px`);
  }
  
  await page1.close();

  // Site 2: Localhost
  console.log('\nCapturing localhost site...');
  const page2 = await context.newPage();
  await page2.goto('http://localhost:3000', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  // Wait for page to fully load
  await page2.waitForTimeout(3000);
  
  // Get full page height
  const localhostHeight = await page2.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Localhost page height: ${localhostHeight}px`);
  
  // Take full page screenshot
  await page2.screenshot({ 
    path: path.join(screenshotsDir, 'localhost-full.png'),
    fullPage: true
  });
  
  // Take screenshots at same scroll positions
  for (let i = 0; i < scrollPositions.length; i++) {
    const scrollY = scrollPositions[i];
    if (scrollY > localhostHeight) break;
    
    await page2.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page2.waitForTimeout(1000);
    
    await page2.screenshot({
      path: path.join(screenshotsDir, `localhost-section-${i + 1}-${scrollY}px.png`)
    });
    console.log(`Localhost section ${i + 1} captured at ${scrollY}px`);
  }
  
  await page2.close();
  await browser.close();
  
  console.log('\nScreenshots saved to:', screenshotsDir);
  console.log('\nFiles created:');
  const files = fs.readdirSync(screenshotsDir);
  files.forEach(file => console.log(`  - ${file}`));
}

captureScreenshots().catch(console.error);
