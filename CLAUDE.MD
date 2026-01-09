# CLAUDE.MD - Project Guide for AI Assistants

## Project Overview

**Project Name:** ryder
**Type:** Hugo Theme
**Version:** 0.1
**License:** MIT
**Author:** Ben Strawbridge

This is a Hugo theme named after a late Rhodesian Ridgeback/Mastiff companion. It's a barebones theme with practical additions for quick setup, built with TailwindCSS, Alpine.js, and Font Awesome.

**Live Demo:** https://arts-link.github.io/ryder/

## Technology Stack

- **Hugo:** Static site generator (requires Hugo 0.146+ for compatibility)
- **TailwindCSS:** v3.4.0+ (utility-first CSS framework)
- **Alpine.js:** Lightweight JavaScript framework
- **Font Awesome:** v6.5.1+ (icon library)
- **PostCSS:** CSS processing with autoprefixer
- **Node.js/npm:** For dependency management

## Project Structure

```
ryder/
├── archetypes/          # Content templates (default.md, recipe.md)
├── assets/              # CSS, JS, and other assets
│   └── css/             # TailwindCSS source files
├── exampleSite/         # Demo site showcasing theme features
│   ├── config/          # Hugo configuration (layered configs)
│   ├── content/         # Example content
│   └── data/            # Data files (social.json, theme.json)
├── i18n/                # Internationalization (en, de, fr)
├── layouts/             # Hugo templates
│   └── partials/        # Reusable template components
├── static/              # Static files
├── .github/workflows/   # GitHub Actions (hugo.yml for builds)
├── package.json         # npm dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # TailwindCSS configuration
└── theme.toml           # Theme metadata
```

## Key Features

1. **Dark Mode:** Toggle for light/dark themes
2. **Notification System:** Shortcode and partial for alerts
3. **Featured Items:** Display page summaries on homepage
4. **Hidden-Home Template:** Special template for cover images
5. **Table of Contents (TOC):** Partial included via front matter
6. **Photo Gallery:** Simple gallery using Alpine.js
7. **Custom RSS Feed:** XSLT-styled RSS
8. **Hugo Debugger:** Template for debugging

## Important Configuration Notes

### Installation Warning
When copying the example config, **ALWAYS delete** the line `themesDir = "../.."` from `/config/_default/hugo.toml` - this is critical and should never be skipped.

### Configuration Structure
This theme uses Hugo's layered configuration:
- `/config/_default/hugo.toml` - Default settings
- `/config/production/hugo.toml` - Production overrides

### GitInfo Performance Consideration

**enableGitInfo** has significant performance implications:
- When enabled: Hugo executes git commands for every page to get commit info
- Theme uses this for footer GitHub links (commit/history/blame)
- On sites with 1000+ pages, this can slow builds by 40-50%
- Default: disabled for performance
- Only enable if GitHub footer links are specifically needed

The theme's `layouts/partials/utils/page_meta.html` conditionally shows git links only when GitInfo is available.

### Key Parameters

```toml
[params]
  isAlpha = true                    # Show global site banner
  showDarkToggle = true             # Display dark mode toggle
  headerGradientClasses = "..."     # TailwindCSS gradient classes

[[params.alphaAlert]]               # Global banner configuration
  alertType = "danger|info|warning"
  alertTitle = "..."
  alertMessage = "..."
  alertIconClass = "fa-solid ..."

[[params.social]]                   # Social links
  faClasses = "..."
  title = "..."
  url = "..."
  target = "_blank"
  weight = 30
```

## Development Workflow

### NPM Scripts
- `npm run build-tw` - Build TailwindCSS
- `npm run deploy-tw` - Build and minify TailwindCSS for production
- `npm run watch-tw` - Watch and rebuild TailwindCSS on changes

### Local Development
```bash
hugo server -D
```

### Testing Theme Changes
The `exampleSite` directory contains a complete test site. Changes to layouts, partials, or assets should be tested here before release.

## Recent Changes & Git History

**Recent commits:**
- Fix Hugo 0.146+ compatibility and improve card link behavior
- The super simple card idea for rnkallday.com
- Card interior updates
- Amazon associate link improvements

**Main Branch:** `main` (use this for PRs)

## Sites Using This Theme

- benstrawbridge.com
- arts-link.com
- writingsos.com
- grrquarterly.com

## Common Tasks

### When Adding New Features
1. Update layouts/partials as needed
2. Test in `exampleSite`
3. Document in README.md if user-facing
4. Update theme.toml version if significant

### When Modifying CSS
1. Edit files in `/assets/css/`
2. Run `npm run watch-tw` during development
3. Build production CSS with `npm run deploy-tw`

### When Creating Shortcodes
1. Add to `/layouts/shortcodes/`
2. Create example usage in `exampleSite/content/posts/`
3. Document usage in README

## Dependencies

### Core NPM Packages
- `@fortawesome/fontawesome-free`: ^6.5.1
- `@tailwindcss/typography`: ^0.5.10
- `autoprefixer`: ^10.4.16
- `postcss`: ^8.4.33
- `postcss-cli`: ^11.0.0
- `postcss-import`: ^16.0.0
- `tailwindcss`: ^3.4.1
- `alpinejs`: latest

## Known Issues & TODOs

- Expand documentation on archetypes usage
- Complete documentation of all variables
- Theme is in v0.1 (work in progress)

## Code Style & Conventions

- Follow Hugo best practices for template development
- Use TailwindCSS utility classes (avoid custom CSS when possible)
- Maintain responsive design principles
- Keep Alpine.js usage minimal and purposeful
- Comment complex template logic

## Testing & CI/CD

GitHub Actions workflow (`hugo.yml`) builds the example site and deploys to GitHub Pages. Check the build badge status before merging changes.

## When Making Changes

1. **Always read existing code first** - Understand current implementation before modifying
2. **Test in exampleSite** - Ensure changes work in the demo environment
3. **Maintain Hugo 0.146+ compatibility** - Recent fixes were needed for this
4. **Update documentation** - Keep README.md current with new features
5. **Avoid over-engineering** - This is intentionally a barebones theme
6. **Consider existing sites** - Changes affect multiple production sites

## Questions to Ask

When uncertain about implementation:
- Should this be a shortcode or a partial?
- Does this need to be configurable via hugo.toml?
- Will this work with Hugo 0.146+?
- Should this be added to the exampleSite for demonstration?
- Does this align with the "barebones with practical additions" philosophy?

## Resources

- Hugo Discourse Forum: https://discourse.gohugo.io/
- Hugo Documentation: https://gohugo.io/documentation/
- TailwindCSS Docs: https://tailwindcss.com/docs
- Alpine.js Docs: https://alpinejs.dev/
