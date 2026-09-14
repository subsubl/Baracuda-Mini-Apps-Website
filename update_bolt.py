import os
import sys

content = """
## 2024-05-25 - [Grid Image Lazy Loading Optimization]
**Learning:** Rendering large lists or grids of images (like the App Grid in `pages/index.vue`) without `loading="lazy"` forces the browser to download all images simultaneously on initial page load, consuming bandwidth and delaying the rendering of critical content (LCP).
**Action:** Always include the native `loading="lazy"` attribute on `<img>` tags for items in large lists or grids that may render below the fold.
"""

try:
    with open(".jules/bolt.md", "a") as f:
        f.write(content)
    print("Updated .jules/bolt.md successfully.")
except Exception as e:
    print(f"Error updating file: {e}")
