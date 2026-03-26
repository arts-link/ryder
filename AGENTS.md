# AGENTS.md

Agent maintenance note for this repository:

- When the theme version receives a minor version bump or anything greater, refresh the Hugo themes submission screenshots in `images/screenshot.png` (1500x1000) and `images/tn.png` (900x600).
- `exampleSite/hugo_stats.json` is generated, but it is intentionally tracked because Tailwind clean builds depend on it. Do not remove it from git. Regenerate and commit it when template, content, or config changes affect Tailwind class discovery.
