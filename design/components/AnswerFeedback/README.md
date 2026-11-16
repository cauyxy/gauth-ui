# AnswerFeedback

What a student sees after an answer: the result, then the reason. `AnswerFeedback` in `src/learning/AnswerFeedback.tsx`.

- `right` says "Correct" in `good` on the `good-soft` ground, with a check on `correct`. `retry` says "Not yet" in `attempted-ink` on `attempted-soft`, with a turn-back arrow on `attempted`. Never red, never "Wrong".
- The words come from the shared list, so they are the same in every product and language. The mark on a fill is ink, never white.
- The content is the product's, at 16px: after a right answer, why it is right; after "Not yet", the step that went wrong and what to try. Never a lost point.
- `aside` is the end of the first line: what the answer earned, as `<Chip tone="violet" className="bg-white">`. Leave it out after "Not yet".
- It goes under the answered `AnswerGroup`, and it rises in one time when it appears.
- A `Reveal` is help a student asks for (a hint) or a reason without a result. After an answer, use this.
