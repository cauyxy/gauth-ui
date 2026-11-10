# Textarea

Several lines of text: a note to students, feedback on an answer. `Textarea` in `src/components/Textarea.tsx`.

- The same box as `Input`: white, the `edge-strong` hairline, `muted` placeholder, an `attempted` outline on `attempted-soft` for an error.
- Sizes: `md` with 14px text and an 8px radius (default); `xl` with 16px text and a 16px radius, for student pages.
- It shows 3 rows by default; set `rows` for more. A person can drag it taller, not wider.
- Put it in a `Field` for its label, hint and error. Alone, give it `label`.
- `onChange` gets the new text.
