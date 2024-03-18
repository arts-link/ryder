[![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)](https://arts-link.github.io/ryder/)


# the ryder theme  

v0.1 - This theme is pretty barebones, with a few additions to get things setup quickly.

I decided to name it after my late friend and companion, the rhodesian ridgeback / mastiff dog named Ryder.
![ryder](https://lh3.googleusercontent.com/pw/ABLVV86vT1B1GlVVA3-ZKPC7-SHC2KkvnhSgeJssyGi31xwtIvEL8-EzKxNSA9uMpJN8GtoTp3RkkVgEog-ZSJsKOJJtIvrB4S81UliRJl6pn8dzIlBTQn6ghn4NsYPIbe2zfJ5diuwzsLfIQco8WnHVgeKMnQ=w822-h617-s-no-gm?authuser=0)

## Demo Site

[Github Pages hosted demo site](https://arts-link.github.io/ryder/)

## Features

- Alert banners
- Dark Mode
- Featured Item blocks on home page
- Special hidden-home template to display only a short message and a large background image cover
- tailwindcss setup and pre-configured with simple copy config setup
- fontawesome icons setup
- toc setup as partial to be included from front matter param

## Installation

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

## TODO

## Sites that are using the ryder hugo theme 

If you are using the ryder hugo theme, [let us know](mailto://hello@arts-link.com?subject=ryder) and you will be added here.

- [arts-link.com](https://www.arts-link.com)
- [grrquarterly](https://www.grrquarterly.com)

## THANK YOU

For the help I found on the internet thank you to these pages:

- [Hugo discourse forum and users](https://discourse.gohugo.io/)
- [Hugo-papermod theme](https://github.com/adityatelange/hugo-PaperMod)
- [hugo-theme-gallery theme](https://github.com/nicokaiser/hugo-theme-gallery)
