from playwright.sync_api import Page, expect, sync_playwright

def test_language_dropdown(page: Page):
    # Navigate to home
    page.goto("http://localhost:3000/Spixi-Mini-Apps-Website/")

    # Wait for hydration
    page.wait_for_timeout(2000)

    dropdown_menu = page.locator("#language-dropdown-menu")
    expect(dropdown_menu).to_be_hidden()

    # Find the button. It is the sibling of the menu.
    # We select the parent div (div.relative) then the button inside it.
    button = page.locator("#language-dropdown-menu").locator("xpath=..").locator("button")

    print("Clicking dropdown button...")
    button.click()

    # Expect menu to be visible
    print("Verifying dropdown is visible...")
    expect(dropdown_menu).to_be_visible()

    # Take screenshot open
    page.screenshot(path="verification/dropdown_open.png")

    # Click outside (e.g. on the logo)
    print("Clicking outside...")
    page.locator("#logo").click()

    # Expect menu to be hidden
    print("Verifying dropdown is hidden...")
    expect(dropdown_menu).to_be_hidden()

    # Take screenshot closed
    page.screenshot(path="verification/dropdown_closed.png")
    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_language_dropdown(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
