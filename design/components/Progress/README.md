# Progress

How far along something is: a practice set, a file, work with no known end. `Progress` in `src/components/Progress.tsx`.

- Ink fill on `track`, 6px high, fully rounded. `value` is 0 to 100.
- Leave `value` out when the end is not known: a segment sweeps across. With reduced motion it rests in the middle.
- Text after the bar says where it stands: "2 of 6", "Building".
- Progress is ink, never a level color: a level bar means skill, progress means how far along.
- `Meter` is the 4px bar inside a row, with no text.
