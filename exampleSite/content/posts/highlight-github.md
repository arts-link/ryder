+++
title = 'Highlight Github'
date = 2024-05-21T22:55:38-07:00
draft = true
# homeFeatureTitle = "Alert boxes"
homeFeatureIcon = "fa-solid fa-code"
tags = ["github","hightlighs"]
[menu]
 [menu.main]
  weight = 1
  parent = 'posts'
+++

[Joe Mooring posted this highlight-github jawn and it looks nifty!](https://www.veriphor.com/articles/syntax-highlighting-for-github-files/)

It allows you to place code on your website directly from your github repo. This is an example from linux...

  <!-- {{< highlight-github owner=torvalds repo=linux path=kernel/time/time.c >}} -->

  {{< highlight-github
      owner=torvalds
      repo=linux
      path=kernel/time/time.c
      lines=55-73
      lang=c
      hl_lines=67-70
      linenos=false
      showlink=false
      branch=b73f0c8f4ba810cd753031d18f4fab83bd9ac58f
  >}}