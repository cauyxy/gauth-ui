# Tabs

Views of one thing, one shown at a time: a class's students, skills and practice. `Tabs`, `TabList`, `Tab` and `TabPanel` in `src/components/Tabs.tsx`.

- A `line` rule runs under the list. The picked tab is ink with a 2px ink underline; the others are `muted`, ink on hover. 14px at 500.
- Two to five tabs, each one or two words. Tabs do not wrap: more views than fit need a different pattern.
- Tabs change what a page shows. A choice that changes how the same content is shown is a `Segmented` control.
- `value` and `onChange` when the page keeps the pick (in the URL, for example); `defaultValue` when it does not.
- The list is one Tab stop: the arrow keys, Home and End move the pick.
