# Separator

A 1px line between two groups of content. `Separator` in `src/components/Separator.tsx` (Radix).

- `line` color, 1px. `horizontal` (default) is as wide as its container; `vertical` stands between items of a row and is as high as the row.
- Space around it comes from the layout (`gap`, a margin), not from the separator.
- Use it between groups, not between every row: rows of a list are already apart. A panel's sections are often clearer with space alone.
- It is decoration by default. `decorative={false}` makes it a `separator` a screen reader hears, for a line that divides two parts of one control.
