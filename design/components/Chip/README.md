# Chip

A short fact attached to a row: a standard code, where a question came from, or what a check found. `Chip` in `src/components/Chip.tsx`.

- 24px high, 6px radius, 12px text at 500, 8px side padding.
- `neutral` has an outline and no fill. A fill is for a fact with a meaning.
- Tones: `neutral` for plain facts, `blue` for standard codes, `good` for checks, `warn` for anything that needs a person's eyes, `violet` for XP and Gauth AI, `pink` for celebration, `ink` for the one emphatic fact.
- Write a standard code the way the standard writes it ("A-REI.B.3").
- One chip per fact. A row with more than three is doing too much.
- A chip may start with an `Icon`. The chip sizes it to 14px and sets it 2px closer to the edge.
- `onRemove` puts a remove button at the end: an attached file ("worksheet.pdf ×"), a picked skill. The button is 20px with a 14px cross, and the chip stays 24px high. The space after the cross looks equal to the space before the text.
- The remove button says "Remove" in the reader's language. Where a row has more than one, give each its own name with `removeLabel` ("Remove worksheet.pdf").
- A chip takes no click itself. A chip to press is a `ChipToggle`.
