# AiStatus

One line that says what Gauth AI is doing, or what it did. `AiStatus` in `src/learning/AiStatus.tsx`.

- The words are the product's and name the real thing: "Reading 28 answers", then "Read 28 answers in Period 3". Not "Thinking", not "Working on it".
- `working`: a 14px spinner, then the text in `ink-soft`. It is a `status`, so a screen reader hears it.
- `done`: the text alone in `muted`. No spinner, no check, no sparkle.
- Only the spinner moves. The text does not pulse or shimmer.
- One line for one piece of work. Work with two to five steps uses `Generating`.
