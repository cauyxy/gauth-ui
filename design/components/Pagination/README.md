# Pagination

The pages of a long list. `Pagination` and `pagesOf` in `src/components/Pagination.tsx`.

- Back and forward are small ghost `IconButton`s. Between them, the page numbers: 30px, 14px at 500 in `muted`. The current page is ink with the 1.5px ink ring of a picked item, not a fill.
- Up to seven pages are all shown. Past that it shows the first and the last page, the current one and its neighbours, and "…" for the pages between.
- Put it under the list it pages, at the start or centered. A list of fewer than about 50 rows reads better on one page, or with "Show more".
- `page` counts from 1. `onChange` gets the new page; move focus or scroll to the top of the list yourself if the page is long.
- It is a `nav` named "Pages". Each number says "Page 3" to a screen reader, and the current one has `aria-current="page"`. With one page it is not drawn.
