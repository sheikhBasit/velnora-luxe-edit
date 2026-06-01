import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Test Desktop
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const desktopPage = await desktopContext.newPage();
  console.log("Navigating to http://localhost:8080 (Desktop)...");
  await desktopPage.goto('http://localhost:8080');
  
  // Check if Shop link is visible on desktop
  const isShopVisibleDesktop = await desktopPage.isVisible('text=Shop');
  console.log(`Desktop - Is 'Shop' link visible? ${isShopVisibleDesktop}`);
  
  await desktopContext.close();

  // Test Mobile (iPhone 12)
  const mobileContext = await browser.newContext({
    ...devices['iPhone 12'],
  });
  const mobilePage = await mobileContext.newPage();
  console.log("Navigating to http://localhost:8080 (Mobile)...");
  await mobilePage.goto('http://localhost:8080');
  
  // Check if Shop link is visible on mobile
  const isShopVisibleMobile = await mobilePage.isVisible('text=Shop');
  console.log(`Mobile - Is 'Shop' link visible? ${isShopVisibleMobile}`);
  
  // Check if a hamburger menu exists (we haven't added one yet, so maybe we look for a button that is not shopping bag)
  // Let's just look at the header
  const headerContent = await mobilePage.textContent('header');
  console.log("Mobile Header content:", headerContent?.replace(/\s+/g, ' ').trim());

  await mobileContext.close();
  await browser.close();
})();
