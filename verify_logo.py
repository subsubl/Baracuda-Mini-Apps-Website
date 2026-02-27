from playwright.sync_api import sync_playwright

def verify_logo(page):
    print("Navigating to home page...")
    page.goto("http://localhost:3000/Spixi-Mini-Apps-Website/")

    # Wait for the logo to be visible
    # The logo is inside the BaseLogo component, which is inside the AppHeader
    # We look for the SVG with the specific class we added or just by structure
    logo_svg = page.locator("nav a#logo svg.text-spixi")

    print("Waiting for logo to be visible...")
    logo_svg.wait_for(state="visible", timeout=10000)

    # Take a screenshot of the header
    header = page.locator("header")
    header.screenshot(path="verification-logo-light.png")
    print("Screenshot taken: verification-logo-light.png")

    # Toggle dark mode
    # Find the theme switcher button
    theme_switcher = page.locator("nav button.text-gray-500")
    # Just clicking it might not be robust if there are multiple buttons, but let's try
    # The theme switcher has an SVG inside.
    # Let's find it by the SVG inside it
    theme_switcher.click()

    # Wait a bit for transition
    page.wait_for_timeout(1000)

    # Take another screenshot
    header.screenshot(path="verification-logo-dark.png")
    print("Screenshot taken: verification-logo-dark.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        verify_logo(page)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
