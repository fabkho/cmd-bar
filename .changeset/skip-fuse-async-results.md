---
"cmd-bar": patch
---

Skip client-side Fuse.js re-filtering for async search results. Groups with a server-side `search()` function already return filtered results — re-running them through Fuse.js (which defaults to `keys: ['label']`) incorrectly dropped valid matches when the query matched non-label fields like email or booking number.
