# PageTitle

The top of a staff page: where it sits, its name and its actions. `PageTitle` in `src/components/PageTitle.tsx`.

- The title is the page's one `h1`: 24px at 700, tight tracking.
- `crumbs` takes a `Breadcrumbs` and sits above the title.
- The children are the page's actions, at the end of the title row. On a phone they wrap under the title.
- One ink button at most. Every other action is `soft` or `outline`.
- No subtitle. A line that explains the page belongs in the page, or nowhere.
