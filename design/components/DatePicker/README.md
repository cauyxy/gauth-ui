# DatePicker

One day, picked from a calendar that opens under the field. `DatePicker` and `Calendar` in `src/components/DatePicker.tsx` (Radix popover).

- The field is the same box as `Select`: white with the control outline, the day at 500, a calendar icon at the end. Sizes: `sm` 30px, `md` 34px (default) and `xl` 44px, chosen the way `Select`'s are.
- The field writes the day the way the product does everywhere, with `formatDay`: "Fri, Oct 23". Before a day is picked it shows `placeholder` in `muted` ("Pick a date" by default).
- The calendar is a white popover without an arrow, 12px padding. Weeks start on Sunday, as in the US. Each day is 34px with an 8px radius: the picked day is `ink` with white text, today has the control outline, a day outside `min` and `max` is at half opacity and cannot be picked.
- Use it for a day that can be any day: a due date, a start date. For a few days the reader already expects ("Today", "Thu", "Fri"), a `Select` or a `Segmented` is quicker.
- `value` is a `Date` or `null`; `onChange` gets the new day as a local `Date` at midnight, and the popover closes. `name` sends the day as `YYYY-MM-DD` with a form.
- Put it in a `Field` for its label, hint and error. Alone, give it `label`: a screen reader says the label and then the day.
- The keyboard: Tab reaches the picked day (or today); the arrow keys move a day or a week, Home and End go to the ends of the week, Page Up and Page Down move a month, with Shift a year. Enter picks, Escape closes, and focus goes back to the field.
- `Calendar` alone is the same month on the page, for a picker that is always open.
