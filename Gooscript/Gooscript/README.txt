Shark Tools - extension_pack

This folder contains a minimal packaged copy of the extension ready for zipping/installing.
Files included (copied from e:\bundle\extension):
- manifest.json
- background.js
- content.js
- setting.html
- setting.js
- image/  (full image assets)

How to use:
1. Open Chrome (or Edge) and go to chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder: e:\bundle\extension_pack
4. Or install the produced zip file: e:\bundle\shark_tools_package.zip (you may need to unzip first depending on browser).

Notes:
- I copied the JS/HTML/manifest files and the image folder. If you changed other files under the original extension directory you want included, copy them into this folder before loading.
- After loading, open the extension's background/service worker console and the settings page to confirm.

If you'd like, I can also: add a sample test script, or reduce host_permissions for privacy, or produce a CRX (requires a key).