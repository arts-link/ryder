# Theme Screenshots

Required for Hugo themes gallery submission (themes.gohugo.io).

## Required files

| File | Dimensions | Purpose |
|------|-----------|---------|
| `screenshot.png` | 1500×1000px | Main gallery thumbnail |
| `tn.png` | 900×600px | Small thumbnail |

## How to generate

1. Install dependencies and start the example site:
   ```sh
   cd exampleSite
   npm ci
   hugo server
   ```
2. Open `http://localhost:1313` in a browser
3. Screenshot the home page at **1500×1000px** → save as `images/screenshot.png`
4. Resize/crop to **900×600px** → save as `images/tn.png`

Both files must live in this `images/` directory at the theme root (not in `static/`).
