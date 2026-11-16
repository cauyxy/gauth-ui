# Tex

A formula, from TeX, drawn by KaTeX. `Tex` in `src/math/Tex.tsx`, imported from `gauth-ui/math` with `gauth-ui/math.css`.

- Inline, a formula stands on the baseline of the words around it and takes their size and color. Its numbers are as tall as the numbers in the words: KaTeX is set at 1.1em, not its own 1.21em.
- `display` sets the formula on its own line, centered. A formula wider than the page scrolls in its own box, and the box is then a Tab stop, so the arrow keys scroll it.
- In a sentence, use `RichText`: it keeps the comma or period after a formula on the formula's line.
- Words and units inside a formula (`\text{ cm}`) are in Google Sans at the size of the words around it.
- A formula is ink. It takes the color of its text, such as `attempted-ink` in a flag. Do not color parts of a formula.
- TeX that cannot be read shows its source in `attempted-ink`. It is never red and it never throws.
- A screen reader gets the formula as MathML.
