# IconButton

A button that shows only an icon: print, copy, close, a vote. `IconButton` in `src/components/IconButton.tsx`.

- `label` is required. It is the button's name for a screen reader, in the reader's language.
- Use it only when the icon is one people know. When in doubt, use a `Button` with a word.
- Four sizes, square, at the control heights: `sm` 30, `md` 34 (default), `lg` 40, `xl` 44px. Touch targets on a student page are `xl`.
- `ghost` (default) has no ground until hover: use it in rows and toolbars. `soft` and `outline` stand alone. `ink` is the one main action, such as Send.
- `pressed` makes it a toggle. On, it has the soft ground and an ink icon.
- The icon comes from `Icon`. Wrap the button in a `Tooltip` when the page has room for one.
