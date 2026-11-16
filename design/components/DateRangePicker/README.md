# DateRangePicker

A first and a last day, picked from one calendar. `DateRangePicker` in `src/components/DateRangePicker.tsx`, on the `Calendar` of `DatePicker`.

- The field is the `DatePicker` field. It writes the range with `formatDay` at both ends: "Mon, Nov 2 – Fri, Nov 13". Before a range is picked it says "Pick dates".
- In the calendar the two ends are picked days (ink, white text) and the days between are on `surface`.
- The first click picks the start, the second the end; a second day before the first becomes the start. Then the popover closes and `onChange` gets `{ from, to }`. Closing after one click keeps the range it had.
- Use it for a span a person sets once: a unit's weeks, the days a report covers. For a span the reader picks from known ones ("This week", "Last 30 days"), a `Segmented` or a `Select` is quicker; offer this as the last option.
- The keyboard is the `Calendar`'s. Enter on a day picks it, as a click does.
- Put it in a `Field` for its label, hint and error. Alone, give it `label`.
