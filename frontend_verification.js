const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set the admin secret cookie to bypass login if possible or just navigate
  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    // Navigate to admin media page
    await page.goto('http://localhost:3000/admin/media');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'admin-media-library.png' });

    // Open bulk upload
    await page.click('button:has-text("Bulk Upload")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'admin-bulk-upload-panel.png' });

    console.log('Screenshots captured successfully.');
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await browser.close();
  }
})();
