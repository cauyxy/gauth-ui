# Breadcrumbs

Where a page sits, and the way back up. `Breadcrumbs` in `src/components/Breadcrumbs.tsx`.

- 12px text in `muted`, with a small chevron between levels. The last item is the page itself: it is ink and it is not a link.
- Each child is one level: a link for a level above, text for the current page.
- Two or three levels. A page at the top level has no breadcrumbs.
- A level uses the same name as the page it opens ("Geometry · Period 3").
- It is a `nav` named "Breadcrumb"; the last item has `aria-current="page"` when it is plain text. A link is never the current page, so a trail of links above a `PageTitle` marks none.
