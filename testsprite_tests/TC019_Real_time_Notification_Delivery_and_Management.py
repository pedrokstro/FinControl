import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Input email and password, then click login button to enter the application.
        frame = context.pages[-1]
        # Input the email for login
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(2000); await elem.fill('demo@financeiro.com')
        

        frame = context.pages[-1]
        # Input the password for login
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(2000); await elem.fill('demo123456')
        

        frame = context.pages[-1]
        # Click the login button to submit credentials
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(2000); await elem.click(timeout=5000)
        
        # Wait for dashboard to load
        await page.wait_for_timeout(3000)

        # -> Test notification system: Click on notification bell icon
        frame = context.pages[-1]
        # Click on the notification bell icon in the header
        bell_button = frame.locator('button:has(svg.lucide-bell)').first
        await page.wait_for_timeout(2000)
        await bell_button.click(timeout=5000)
        
        # Wait for dropdown to open
        await page.wait_for_timeout(1000)

        # --> Assertions to verify notification system
        frame = context.pages[-1]
        
        # Verify notification dropdown is visible
        await expect(frame.locator('text=Notificações').first).to_be_visible(timeout=5000)
        
        # Verify notification header elements
        notification_header = frame.locator('h3:has-text("Notificações")').first
        await expect(notification_header).to_be_visible(timeout=5000)
        
        # Verify either notifications exist or "Nenhuma notificação" message
        try:
            # Try to find notification items or empty state
            await expect(frame.locator('text=Nenhuma notificação').first).to_be_visible(timeout=2000)
            print("✅ Notification system working: Empty state displayed")
        except:
            # If not empty, check for notification items
            await expect(frame.locator('div[class*="border-b"]').first).to_be_visible(timeout=2000)
            print("✅ Notification system working: Notifications displayed")
        
        # Close notification dropdown
        close_button = frame.locator('button:has(svg.lucide-x)').first
        await close_button.click(timeout=5000)
        
        print("✅ Notification test passed: System is functional and accessible")
        await asyncio.sleep(2)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    