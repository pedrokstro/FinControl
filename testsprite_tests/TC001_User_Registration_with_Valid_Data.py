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
        # -> Click on 'Criar conta' link to go to the registration page.
        frame = context.pages[-1]
        # Click on 'Criar conta' link to navigate to registration page
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[2]/p/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the registration form with valid username, email, password, confirm password, accept terms, and submit.
        frame = context.pages[-1]
        # Enter valid username in 'Nome Completo' field
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo@financeiro.com')
        

        frame = context.pages[-1]
        # Enter valid email in 'Email' field
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo@financeiro.com')
        

        frame = context.pages[-1]
        # Enter valid password in 'Senha' field
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo123456')
        

        frame = context.pages[-1]
        # Enter valid password confirmation in 'Confirmar Senha' field
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo123456')
        

        frame = context.pages[-1]
        # Check the 'Eu concordo com os Termos de Serviço e Política de Privacidade' checkbox
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[5]/label/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click the 'Criar Conta' button to submit the registration form
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Correct the 'Nome Completo' field to a valid name and update the password to include at least one uppercase letter, then submit the form again.
        frame = context.pages[-1]
        # Correct 'Nome Completo' field to a valid name with letters only
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('João Silva')
        

        frame = context.pages[-1]
        # Update password to include at least one uppercase letter
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Demo123456')
        

        frame = context.pages[-1]
        # Update password confirmation to match the new password
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Demo123456')
        

        frame = context.pages[-1]
        # Click the 'Criar Conta' button to submit the corrected registration form
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Change the email to a unique one and submit the registration form again.
        frame = context.pages[-1]
        # Change email to a unique email address to avoid duplication error
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('demo+unique@financeiro.com')
        

        frame = context.pages[-1]
        # Click 'Criar Conta' button to submit the registration form with unique email
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Verifique seu Email').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enviamos um código de 6 dígitos para demo+unique@financeiro.com').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=O código expira em 15 minutos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Verificar Email').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Não recebeu o código?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reenviar código').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Voltar para o login').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=💡 Dica: Você pode colar o código completo de uma vez').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    