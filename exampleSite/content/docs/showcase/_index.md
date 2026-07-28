+++
title = "Showcase"
description = "An intentionally empty data-driven section — demonstrates emptyDataMessage, the counterpart to a menu entry gated with hideIfEmptyData."
layout = "list-plain"
dataSource = "showcase"
emptyDataMessage = "No sites listed yet — open a PR to add yours."
homeFeatureIcon = "fa-solid fa-globe"
[menu]
 [menu.main]
  weight = 53
  parent = 'docs'
+++

Sites built with Ryder, sourced from `data/showcase.json`. That file does not exist in this exampleSite.

**This page's menu entry is not gated**, so it stays in the Docs menu regardless, and the page explains itself via `emptyDataMessage` rather than the link silently disappearing. That is the opposite choice from [Releases](../releases/).

Two right answers, depending on what "empty" means to a visitor:

| Behavior | Where it's configured | Use when |
|---|---|---|
| Menu entry disappears | `hideIfEmptyData` under the entry's `params` | An empty section is meaningless — nothing to come back for |
| Menu entry stays, page explains | `dataSource` + `emptyDataMessage` in front matter | An empty section is expected to fill in later |
