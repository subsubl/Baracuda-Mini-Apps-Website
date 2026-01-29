from playwright.sync_api import Page, expect, sync_playwright

def test_homepage_images(page: Page):
    # Navigate to the homepage
    page.goto("http://localhost:3000/Spixi-Mini-Apps-Website/")

    # Wait for the hero section to be visible
    # Using first() to select the hero banner, as the footer CTA also uses this class
    expect(page.locator(".bg-hero-gradient").first).to_be_visible()

    # Wait for app cards to load
    try:
        page.wait_for_selector(".app-card", timeout=10000)
    except:
        print("App cards did not load within timeout.")

    # Screenshot
    page.screenshot(path="/app/verification/homepage.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_homepage_images(page)
        finally:
            browser.close()
