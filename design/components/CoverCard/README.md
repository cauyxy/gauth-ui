# CoverCard

A card with a picture on top, then a title and one line: a tool, a resource, a saved document. `CoverCard` in `src/components/CoverCard.tsx`.

- 16px radius, white, `shadow-edge`, no drop shadow: the same card as a `Panel`. On hover the hairline gets firmer (`shadow-edge-strong`). Nothing moves.
- The cover is 16 by 10 on the `surface` ground, and its top corners follow the card. An `<img>` fills it and is cropped, not stretched. Without a picture, put one block in it that draws its own ground: a `<span>` fills the cover by itself, an `<svg>` needs `width` and `height` of 100%.
- Below, with 16px padding: the title, 14px at 600, on one line; the description, 12px `muted`, on two lines at most; then `meta`, a chip or a date.
- The whole card is one target. With `href` it is a link; without, a button with `onClick`. So `cover` and `meta` hold nothing to click: no button, no removable chip.
- The cover is decoration: give its image `alt=""`. The title names the card.
- Cards go in a grid. The cards of one row are equally high, and their meta lines share one bottom edge.
- Write the title as the thing's name ("Exit ticket: similar triangles") and the description as what it holds or makes. No "Click to open".
