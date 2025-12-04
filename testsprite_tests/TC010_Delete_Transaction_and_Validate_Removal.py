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
        # -> Input email and password, then click login button to access the application.
        frame = context.pages[-1]
        # Input the email demo@financeiro.com
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo@financeiro.com')
        

        frame = context.pages[-1]
        # Input the password demo123456
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo123456')
        

        frame = context.pages[-1]
        # Click the Entrar button to login
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Transacoes' link in the sidebar to navigate to the Transactions page.
        frame = context.pages[-1]
        # Click on 'Transacoes' link in the sidebar to navigate to the Transactions page
        elem = frame.locator('xpath=html/body/div/div/aside/nav/ul/li[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the delete button for the first transaction (Shoppe, R$ 500,00 despesa) to initiate deletion.
        frame = context.pages[-1]
        # Click the delete button for the first transaction (Shoppe) to initiate deletion
        elem = frame.locator('xpath=html/body/div/div/div/main/div/div/div/div[4]/div/table/tbody/tr/td[6]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Excluir' button in the confirmation modal to confirm deletion of the transaction.
        frame = context.pages[-1]
        # Click the 'Excluir' button to confirm deletion of the 'Shoppe' transaction
        elem = frame.locator('xpath=html/body/div/div/div/main/div/div/div/div[6]/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Shoppe').first).not_to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total de Transacoes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Receitas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 6.000,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 5.400,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Saldo').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 600,00').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    