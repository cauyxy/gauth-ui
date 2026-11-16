# Sheet

A panel that slides in from an edge of the page. `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent` in `src/components/Sheet.tsx` (Radix).

- White, the full height of the page, up to 420px wide with a 16px gutter on a phone, 24px padding, `shadow-pop`, on the same scrim as a `Dialog`. The corners away from the edge are 24px round.
- `side="end"` (default) comes from the right; `start` from the left, for navigation on a phone.
- It slides in and fades out, faster than it came.
- `title` is required and is its accessible name; `description` is one muted line under it. Then the body, which scrolls inside the sheet.
- Use it for detail beside a list that the person comes back to (a student from a roster, the filters of a long table on a phone). A question the page must wait for is a `Dialog`; a short choice next to a control is a `Popover`.
- It closes on Escape, on a click on the scrim and on the close button. Focus stays inside while it is open and returns to what opened it.
