# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ryder** is a Hugo theme (v0.1) built with TailwindCSS, Alpine.js, and Font Awesome. Named after a late Rhodesian Ridgeback/Mastiff companion, it's intentionally barebones with practical additions for quick setup.

- **Live Demo:** https://arts-link.github.io/ryder/
- **License:** MIT
- **Production Sites:** benstrawbridge.com, arts-link.com, writingsos.com, grrquarterly.com

## Technology Requirements

- **Hugo:** 0.146+ (compatibility requirement)
- **Node.js/npm:** For dependency management
- **TailwindCSS:** v3.4.0+
- **Alpine.js:** Lightweight JavaScript framework
- **Font Awesome:** v6.5.1+

## Development Commands

### CSS Development
```bash
npm run build-tw     # Build TailwindCSS
npm run deploy-tw    # Build and minify for production
npm run watch-tw     # Watch mode for development
```

### Hugo Commands
```bash
hugo server -D                    # Local development with drafts
hugo server -D --source exampleSite  # Test theme in exampleSite
hugo --minify                     # Production build
```

### Testing
The `exampleSite/` directory is the primary test environment. All theme changes MUST be tested here before release.

## Architecture Overview

### Template Hierarchy & Customization

The theme uses Hugo's template lookup order with a powerful customization system:

1. **Base Templates** (`layouts/_default/`)
   - `baseof.html` - Root template with header/footer partials
   - `home.html`, `list.html`, `single.html` - Page type templates
   - `hidden-home/baseof.html` - Special cover image template

2. **Dynamic Partial Loading** (`layouts/partials/`)
   Theme supports variants via configuration parameters:
   - Header: `header.html` (default) or `header-fun.html` (via `headerType = "-fun"`)
   - Menu: `menu.html` (default) or `menu-fun.html` (via `menuType = "-fun"`)
   - Footer: `footer.html` (default) or `footer-fun.html` (via `footerType = "-fun"`)
   - Cards: Multiple variants (`card-super-simple.html`, etc.) via `listCardType`

   **Implementation pattern in baseof.html:**
   ```go
   {{ $headerType := .Param "headerType" | default "" }}
   {{- partial (printf "header%s.html" $headerType) . }}
   ```
   This allows users to set custom variants in config or front matter without editing theme files.

3. **Partial Organization**
   - `partials/common-partials/` - SEO, OpenGraph, Twitter Cards
   - `partials/head/` - CSS, JS, fonts, favicon, schema markup
   - `partials/utils/` - Reusable utilities (dark toggle, page meta, social lists)

4. **Shortcodes** (`layouts/shortcodes/`)
   Content embeds: alerts, photo galleries, affiliate links, maps (Leaflet/OpenStreetMap), recipe schemas, custom media players (Soundcloud, Webamp)

### CSS Architecture

- **Source:** `assets/css/main.css` (TailwindCSS source)
- **Output:** `assets/css/style.css` (generated, don't edit directly)
- **Config:** `tailwind.config.js` with custom screens, fonts, background images
- **PostCSS:** `postcss.config.js` (autoprefixer processing)
- **JIT Compilation:** TailwindCSS scans `hugo_stats.json` for class usage (configured in `build.cachebusters`)

**Hugo integration:** The theme uses Hugo's asset pipeline with cache busting for Tailwind, PostCSS, and JS files.

### Configuration System

**Layered configs** (Hugo's multi-environment setup):
- `/config/_default/hugo.toml` - Base configuration
- `/config/production/hugo.toml` - Production overrides (analytics, GitInfo, etc.)

**Key parameter groups:**
```toml
[params]
  isAlpha = true                 # Global site banner
  showDarkToggle = true          # Dark mode toggle
  showCardLinkOverlay = false    # Card link behavior
  repository = "..."             # GitHub repo for footer links

[params.footer]
  tagCloud = true                # Enable footer taxonomies

[[params.footer.taxonomies]]     # Opt-in taxonomy display
  name = "tags"
  title = "Top Tags"
  minCount = 2

[[params.alphaAlert]]            # Site-wide banners (can have multiple)
  alertType = "danger|info|warning|success"
  alertTitle = "..."
  alertMessage = "..."
  dismissable = true

[[params.social]]                # Social links (footer/elsewhere)
  faClasses = "fa-brands fa-github"
  url = "..."
  weight = 20                    # Display order
```

## Critical Installation Notes

### When Copying exampleSite Config
**ALWAYS delete** the line `themesDir = "../.."` from `/config/_default/hugo.toml`. This is for theme development only and will break normal installations.

### GitInfo Performance Warning
- **`enableGitInfo = true`** runs git commands for every page to get commit metadata
- Used for footer GitHub links (commit/history/blame) via `layouts/partials/utils/page_meta.html`
- **Performance impact:** 40-50% slower builds on sites with 1000+ pages
- **Default:** Disabled for performance
- Only enable if GitHub footer links are specifically needed

### Footer Taxonomies (Opt-in)
By default, footer shows NO taxonomy lists. Must configure `params.footer.taxonomies` to display tags/categories.

## Development Philosophy

**Barebones with practical additions** - Avoid over-engineering:
- Don't add features beyond what's requested
- Use TailwindCSS utilities over custom CSS
- Keep Alpine.js usage minimal
- Don't add error handling for impossible scenarios
- Don't create abstractions for one-time operations
- Don't add backwards-compatibility hacks

## Development Workflow

### Adding New Features
1. Read existing code first to understand patterns
2. Update `layouts/` or `layouts/partials/` as needed
3. Test in `exampleSite/` directory
4. Document in README.md if user-facing
5. Update `theme.toml` version if significant
6. Maintain Hugo 0.146+ compatibility

### Modifying CSS
1. Edit source files in `assets/css/main.css`
2. Run `npm run watch-tw` during development
3. Test with `hugo server -D`
4. Build production CSS with `npm run deploy-tw`

### Creating Shortcodes
1. Add to `layouts/shortcodes/`
2. Create example in `exampleSite/content/posts/`
3. Document usage in README

### Template Customization Pattern
When creating new template variants:
- Follow the `{partial}{suffix}.html` naming pattern
- Use `.Param "{type}Type"` to load variants
- Support both config-level and front-matter overrides
- Test default behavior when parameter is unset

## CI/CD

GitHub Actions (`.github/workflows/hugo.yml`) builds exampleSite and deploys to GitHub Pages on every push to `main`. Check build badge status before merging changes.

**Workflow details:**
- Uses Hugo 0.138.0 (update as needed)
- Runs `npm ci` in exampleSite directory
- Builds with `--minify` flag
- Deploys to https://arts-link.github.io/ryder/

## Known Issues

- Theme is v0.1 (work in progress)
- Archetype documentation needs expansion
- Not all configuration variables are documented

## Design Decisions to Ask About

When implementation approach is unclear:
- Should this be a shortcode or a partial?
- Does this need configuration via hugo.toml?
- Should this support the variant suffix pattern (e.g., `-fun`, `-custom`)?
- Should this be demonstrated in exampleSite?
- Does this align with "barebones with practical additions"?
- Will this work across all production sites using the theme?

## Resources

- Hugo Discourse: https://discourse.gohugo.io/
- TailwindCSS Docs: https://tailwindcss.com/docs
- Alpine.js Docs: https://alpinejs.dev/
