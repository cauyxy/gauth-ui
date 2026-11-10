# Table

Rows of the same kind of thing, in columns: a roster, a list of skills. `Table`, `TableHead`, `TableRow` and `TableCell` in `src/components/Table.tsx`.

- Column heads are 11px, `muted`, uppercase, with no fill. Rows are 14px at 500, at least 56px high, with a `line` border between them.
- `columns` is one `grid-template-columns` value for every row: `minmax(0, 1.4fr) minmax(0, 1fr) 5.5rem`. Use `minmax(0, …)` so long text is cut. Each row is its own grid, so do not use `auto`: a column would be a different width in each row.
- A row ends with one action, a `sm` outline button, in a cell with `align="end"`. Its column head is empty.
- A secondary cell (a date, a count) is `muted`. Only the name is ink.
- Put it in a `Panel`. The table has no outline of its own.
- It is for reading rows. A table that sorts, selects or pages stays in its product.
