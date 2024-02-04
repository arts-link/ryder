+++
title = 'A Randomized Peaceful Page'
date = 2024-01-31T14:32:26-08:00
# draft = true
type = 'hidden-home'
randomizeBackground = true
# enableDebugPanel = true 

[menu]
 [menu.main]
  parent = 'peaceful'
  weight = 22
  name = 'random peace'
+++
This one loads random background images because it has the front matter variables set. 

Another version of this page is [peaceful](../peaceful) and it will load just the one bg-image from the tailwind.config.js

```
type = 'hidden-home'
randomizeBackground = true
```

It is a truly peaceful moment. This is it, just place an image in your sites `static/images` directory called `hidden-home-cover.webp` and it will be used for the default background image. 

In your site `assets` directory add a file - `/assets/js/extended.js` and add something this to load your own images, either local or external.

```js
// Check if the changeBackgroundImage function exists before calling it
if (typeof changeBackgroundImage === 'function') {
  changeBackgroundImage([
    'https://lh3.googleusercontent.com/pw/ABLVV84PckiqmIJNE5iB3BI_vV-grDSeDQfjyyLolAE1_t_No1Z_IlzgI9UJ5rvabL5U-gnT_v7_S07qkzF-ucjzEJT5kLFwtUaLwfebH-2R4GiUDEIukIfOHaEVi_JECfmXOyDDAsb3zwNfaZN78b2lXbwxgg=w613-h1088-s-no-gm?authuser=0',
    'https://lh3.googleusercontent.com/pw/ABLVV854B1XWYwZtzSIxhizEmGnrW1jgdyI0P9gQ942oI715M_4mGXWUIniRb5p5xedTx9WS4_nGIB_IOdK9ypRNDDPStmqwpwMA_RdC6NwtolzRe1uN0d6_NIISimDXWuiuM91pzNh4RMtpyUkybPcg3hWHxw=w613-h1088-s-no-gm?authuser=0',
  ]);
}
```

Since there are no links on this page, just click back to [exampleSite](../).  
