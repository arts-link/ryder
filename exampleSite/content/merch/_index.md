+++
title = "Merch"
description = "An intentionally empty data-driven section — demonstrates emptyDataMessage, the counterpart to the menu's hideIfEmptyData."
layout = "list-plain"
dataSource = "merch"
emptyDataMessage = "Nothing for sale yet — check back soon."
+++

This section has no `data/merch.json`, and its nav entry is **not** gated with `hideIfEmptyData`. So the entry stays visible and this page explains itself, rather than the link silently disappearing.

That is the opposite choice from [Releases](../releases/), whose menu entry *is* gated — a Releases link with nothing behind it would be a dead end, so it vanishes entirely when `data/releases.json` is empty.

Two different right answers, depending on whether an empty section means "not yet" or "not applicable":

| Behavior | Where it's configured | Use when |
|---|---|---|
| Nav entry disappears | `hideIfEmptyData` under `[menus.<id>.params]` | An empty section is meaningless to a visitor |
| Nav entry stays, page explains | `dataSource` + `emptyDataMessage` in front matter | An empty section is expected to fill in later |
