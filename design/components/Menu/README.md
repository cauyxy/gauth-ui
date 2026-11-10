# Menu

A short list of actions that opens from a button. `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuSeparator` in `src/components/Menu.tsx` (Radix DropdownMenu).

- White, 12px radius, 6px padding, at least 220px wide, `shadow-pop`, 6px from its button. It grows out of the button and flips to stay on screen.
- A row is 34px high with 14px text at 500. The row under the pointer or the arrow keys gets the `surface` fill. A disabled row is `muted`.
- `MenuSeparator` is a `line` rule between groups of actions. Use one or two, not one after each row.
- The menu is one Tab stop: the arrow keys move, a typed letter jumps to a row, Enter picks it and Escape closes. A row reached with the keys also shows the focus ring.
- A row is one or two verbs: "View progress", "Send practice". Nothing in a menu is red.
- A menu holds actions. A choice that stays picked is a `Segmented` control or a `Select`.
