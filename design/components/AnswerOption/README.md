# AnswerOption

The options of one question, and the feedback on the answer. `AnswerGroup` and `AnswerOption` in `src/learning/AnswerOption.tsx`.

- An option is a white row with a hairline, at least 44px high: a round letter mark, then the content. The content is the product's: text, a formula, a figure.
- Picked: the row stays white and gets the ink outline. Only its letter mark turns ink.
- `state="right"`: a soft green ground, a check on the `correct` fill and the word "Correct". The row swells one time.
- `state="retry"`: a soft orange ground, the letter on the `attempted` fill and the words "Not yet". The row moves side to side one time. Never red, and never the word "Wrong".
- The letter or the check on a fill is ink, not white.
- `AnswerGroup` is a radio group and one Tab stop: the arrow keys move the pick. The options are its direct children. `label` is the question or a short name for it.
- Set `disabled` on the group when the question is answered. The options keep their full color.
