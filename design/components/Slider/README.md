# Slider

A number picked by dragging along a track. `Slider` in `src/components/Slider.tsx` (Radix).

- A 6px `track` with the part up to the value in `ink`, and an 18px white thumb with the 1.5px ink ring. The control is 30px high, so the thumb is easy to grab.
- Use it for a number where about right is good enough and the range is short: a daily goal, a share of questions, a length. For an exact number, use `NumberInput`.
- Show the value in words beside it ("10 questions a day"). The slider does not print it, and `formatValue` gives a screen reader the same words.
- `label` is its accessible name. `step` sets how far one arrow key moves; Page Up and Page Down move ten steps, Home and End go to the ends.
- `onChange` gets the new number while the thumb moves.
