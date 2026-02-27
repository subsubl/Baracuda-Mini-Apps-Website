from playwright.sync_api import sync_playwright

def verify_logo_and_theme(page):
    print("Navigating to home page...")
    # Go to the local dev server
    page.goto("http://localhost:3000/Spixi-Mini-Apps-Website/")

    # Wait for the logo (BaseLogo component) to be visible.
    # We added the class "text-spixi" to the SVG in BaseLogo.vue.
    # It should be inside the anchor with id="logo".
    logo_svg = page.locator("#logo svg.text-spixi")

    print("Waiting for logo to appear...")
    logo_svg.wait_for(state="visible", timeout=10000)

    # Capture the header area for the light mode screenshot
    header_element = page.locator("header")
    header_element.screenshot(path="verification-header-light.png")
    print("Captured light mode screenshot: verification-header-light.png")

    # Now, find and click the theme switcher to toggle dark mode.
    # The theme switcher button contains an SVG and has classes like "text-gray-500".
    # Based on the previous error, there are two such buttons (the other is the hamburger menu).
    # The theme switcher is the first one in the DOM order within the nav usually, or we can use :nth-match.
    # Alternatively, the theme switcher button has an SVG path specific to it (moon or sun).
    # Let's target it by the SVG inside it to be more specific.
    # In light mode (default), the moon icon is shown.
    # In dark mode, the sun icon is shown.

    # Let's try to click the button that contains the moon icon path.
    # Moon icon path starts with "M17.293 13.293..."
    # Sun icon path starts with "M10 2a1 1 0 011 1v1..."

    # Wait for the theme switcher button to be clickable
    # We'll select the button that is NOT the hamburger menu.
    # The hamburger menu has aria-controls="navbar-hamburger".
    theme_switcher = page.locator("nav button:not([aria-controls='navbar-hamburger'])").first

    print("Clicking theme switcher...")
    theme_switcher.click()

    # Wait a moment for the theme transition to apply (Tailwind classes to change)
    page.wait_for_timeout(1000)

    # Capture the header area for the dark mode screenshot
    header_element.screenshot(path="verification-header-dark.png")
    print("Captured dark mode screenshot: verification-header-dark.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        verify_logo_and_theme(page)
    except Exception as e:
        print(f"Error during verification: {e}")
    finally:
        browser.close()
