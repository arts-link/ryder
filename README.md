![exampleSite build](https://github.com/arts-link/ryder/actions/workflows/hugo.yml/badge.svg)


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
- Special hidden-home template to display only a short message and a large bg image cover
- tailwindcss setup and pre-configured with simple copy config setup
- fontawesome icons setup
- toc setup as partial to be included from front matter param

## Installation

### As Git Submodule

Inside the folder of your Hugo site run:

```
$ git submodule add https://github.com/arts-link/ryder.git themes/ryder
```
For more information read the official [setup guide](//gohugo.io/getting-started/quick-start/) of Hugo.

## Getting started

After installing the theme successfully you need to follow a few steps in order to get your site running.


### The config files

#### Hugo's config.toml
Take a look inside the [`exampleSite`](https://github.com/arts-link/ryder/tree/main/exampleSite) folder of this theme. You'll find a file called [`config.toml`](https://github.com/arts-link/ryder/blob/main/exampleSite/config.toml). To use it, copy the [`config.toml`](https://github.com/arts-link/ryder/blob/main/exampleSite/config.toml) in the root folder of your Hugo site. Feel free to change the strings in this theme.

Depending on your deplpoyment setup I recommend using layered config directories. Instead of putting `config.toml` into the root directory, create a new directory `config`, with a subdirectory `_default` and place the `config.toml` file in there. When it comes time to deploy, create a subdirectory `production` which will contain things like a google analytics configuration setting, things you want to only be activate in production or production-like environments. Any other environment may be added in this layered way... _default is always used, and anything in the environment folder is layered over, not merged. I use this to have a different title to the site in development and production so it is easy to see what you are looking at.

```
config/
-- _default/
  -- config.toml
-- production/
  -- config.toml
```

- You need to delete the line: `themesDir = "../.."` from your new `config.toml` file.

#### Tailwind.css

In order to have tailwind run, copy `tailwind.config.js` and `postcss.config.js` from `exampleSite` to the root of your site. 

## Installation

This starts from the very top with no hugo website yet created.

```bash
➜ hugo new site grrquarterly
➜ cd grrquarterly
➜ git init
➜ git submodule add https://github.com/arts-link/ryder.git themes/ryder
➜ mkdir -p config/{_default,production}
➜ cp themes/ryder/exampleSite/config.toml config/_default/hugo.toml
# edit the config to setup for your own project and needs
➜ cp themes/ryder/exampleSite/*.config.js .
# edit the tailwindcss.config.js file to include the files it needs to watch
# probably something like ... content: ["./hugo_stats.json", "./layouts/**/*.html", "./themes/ryder/layouts/**/*.html"],
➜ cp themes/ryder/exampleSite/package.json .
➜ npm install
➜ hugo server
```

## Configuration

- TODO: Document all the variables  

## TODO

- document alert.html partial

## THANK YOU

- For the help I found on the internet thank you to these pages:
- [Hugo-papermod theme](https://github.com/adityatelange/hugo-PaperMod)
- [hugo-theme-gallery theme](https://github.com/nicokaiser/hugo-theme-gallery)
