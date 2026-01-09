[![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)](https://arts-link.github.io/ryder/)

# TLDR;

If your in a hurry and like to skip the words, let's just get in and out quickly

```bash
hugo new site <your-site>
cd <your-site>
git init
# install theme
git submodule add https://github.com/arts-link/ryder.git themes/ryder
# copy configs from exampleSite
cp -r themes/ryder/exampleSite/config/ ./config
# copy archetypes from example site if you want to use the themes archetypes
# TODO exapand on this
cp themes/ryder/exampleSite/archetypes/*.md ./archetypes
#### IMPORTANT DO NOT SKIP
# Delete the line: `themesDir = "../.."` from your new `/config/_default/hugo.toml` file.
# install npm dependencies
cp themes/ryder/exampleSite/package.json .
npm install
# create a home page
hugo new content index.md
# start the server (with drafts so you see that new page)
hugo server -D
```


# the ryder theme  

v0.1 - This theme is pretty barebones, with a few additions to get things setup quickly.

I decided to name it after my late friend and companion, the rhodesian ridgeback / mastiff dog named Ryder.
![ryder](https://arts-link.github.io/ryder/images/ryder-theme-og.webp)

## Demo Site

[Github Pages hosted demo site](https://arts-link.github.io/ryder/)

## Features
- Notification shortcode and partial 
- Dark Mode
- Featured Item blocks on home page can display summary of any page on site
- Special hidden-home template to display only a short message and a large background image cover
- tailwindcss setup and pre-configured with simple copy config setup
- fontawesome icons setup
- toc setup as partial to be included from front matter param
- alpinejs setup configured for use
- super simple photogallery using alpinejs
- custom xslt stylized rss feed
- social data file
- hugo debugger template

## Installation

[Get Hugo!](https://www.gethugo.io)

### If you don't have a hugo site setup yet

This starts from the very top with no hugo website yet created.

```bash
hugo new site <your-site>
cd <your-site>
git init
```

### As Git Submodule

Inside the folder of your Hugo site run:

```bash
git submodule add https://github.com/arts-link/ryder.git themes/ryder
```
For more information read the official [setup guide](//gohugo.io/getting-started/quick-start/) of Hugo.

## Getting started

After installing the theme successfully you need to follow a few steps in order to get your site running.

### The config files

#### Hugo's config.toml
Take a look inside the [`exampleSite`](https://github.com/arts-link/ryder/tree/main/exampleSite) folder of this theme. You'll find a file called [`hugo.toml`](https://github.com/arts-link/ryder/blob/main/exampleSite/config/_default/hugo.toml).


Depending on your deplpoyment setup I recommend using layered config directories. Instead of putting `hugo.toml` into the root directory, create a new directory `config`, with a subdirectory `_default` and place the `config.toml` file in there. When it comes time to deploy, create a subdirectory `production` which will contain things like a google analytics configuration setting or a different title in development and production, so it is easy to see where you are, any things you want to only be active in production or production-like environments. Any other environment may be added in this layered way. _default is always used, and anything in the environment folder is layered over, not merged. [See more about this setup](https://gohugo.io/getting-started/configuration/#configuration-directory)

```bash
# this will also get you a production config directory 
cp -r themes/ryder/exampleSite/config/ ./config
```

#### IMPORTANT DO NOT SKIP
Delete the line: `themesDir = "../.."` from your new `/config/_default/hugo.toml` file.
Update the `baseURL= "https://arts-link.github.io/ryder/"` to point to your own URL

### NPM package installation
Next you will need to install the packages that are used for this theme. These are all nodejs modules which are installed from the npm package registry. These are all open source files. This is defined in the [`package.json`](https://github.com/arts-link/ryder/tree/main/exampleSite/package.json) file
- [@fortawesome/fontawesome-free version](https://www.npmjs.com/package/@fortawesome/fontawesome-free): ^6.5.1
- [@tailwindcss/typography version](https://www.npmjs.com/package/@tailwindcss/typography): ^0.5.10
- [autoprefixer version](https://www.npmjs.com/package/autoprefixer): ^10.4.16
- [postcss version](https://www.npmjs.com/package/postcss): ^8.4.33
- [postcss-cli version](https://www.npmjs.com/package/postcss-cli): ^11.0.0
- [postcss-import version](https://www.npmjs.com/package/postcss-import): ^16.0.0
- [tailwindcss version](https://www.npmjs.com/package/tailwindcss): ^3.4.1
- [alpinejs](https://www.npmjs.com/package/alpinejs)

```bash
cp themes/ryder/exampleSite/package.json .
npm install
```

#### tailwind and postcss have their own config files, copy them over

```bash
cp themes/ryder/exampleSite/*.config.js .
```

## Configuration

- TODO: Finish Documenting all the variables  
Defined in `/config/_default/hugo.toml`
```toml
[params]
  # show the global site banner, must set params.alphaAlert to configure.
  isAlpha = true
  # dark mode switch defaults to hidden, remove this line or set to false to hide
  # alternatively, and probably more useful, use system dark mode by removing darkMode: 'class', from tailwind.config.js
  showDarkToggle = true 
  headerGradientClasses = "bg-gradient-to-r from-rose-500 to-rose-800" 
[[params.alphaAlert]]
  alertType = "danger"
  alertTitle = "Global Banners"
  alertMessage = "This theme is a work in progress! <a href='/posts/alerts' class='underline'>learn more about them!</a>"
  alertIconClass = "fa-solid fa-camera-retro"
[[params.alphaAlert]]
  alertType = "info"
  alertTitle = "2 Global Banners are possible"
  alertMessage = "This theme is a work in progress! <a href='/posts/alerts' class='underline'>learn more about them!</a>"
  alertIconClass = "fa-solid fa-camera-retro"
[[params.social]]
  faClasses = "fa-solid fa-envelope"
  title = "Email me"
  url   = "mailto:hello@arts-link.com?subject=web"
  target= "_blank"
  weight = 30 
[[params.social]]
  faClasses = "fa-brands fa-github"
  title = "GitHub"
  url   = "https://www.github.com/arts-link"
  target= "_blank"
  weight = 20
```

### Performance: GitInfo Configuration

**enableGitInfo** (optional, default: false)

When enabled, Hugo runs git commands for every page to get commit history. The theme uses this to display GitHub links in the footer (commit hash, history, blame links).

**Performance Impact:**
- **Enabled:** Significantly slower builds (40-50% slower on large sites)
- **Disabled:** Faster builds, but no GitHub footer links

**Configuration:**
```toml
# In config/production/hugo.toml
enableGitInfo = true  # Show git links, slower builds
# OR
# enableGitInfo = false  # No git links, faster builds (recommended)
```

**Note:** Most sites don't need GitInfo. Only enable if you specifically want GitHub commit links in the footer.

## TODO

## Sites that are using the ryder hugo theme 

If you are using the ryder hugo theme, [let us know](mailto://hello@arts-link.com?subject=ryder) and you will be added here.

- [benstrawbridge.com](https://www.benstrawbridge.com)
- [arts-link.com](https://www.arts-link.com)
- [writingsos.com](https://www.writingsos.com)
- [grrquarterly](https://www.grrquarterly.com)

## THANK YOU

For the help I found on the internet thank you to these pages:

- [Hugo discourse forum and users](https://discourse.gohugo.io/)
- [Hugo-papermod theme](https://github.com/adityatelange/hugo-PaperMod)
- [hugo-theme-gallery theme](https://github.com/nicokaiser/hugo-theme-gallery)
