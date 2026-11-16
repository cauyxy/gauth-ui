# Reveal

Help that arrives under a question: a hint before the answer, or the reason after it. `Reveal` in `src/learning/Reveal.tsx`.

- `hint` is quiet: a `surface` ground. It gives one step of help and does not give the answer.
- `why` has the `good-soft` ground. Show it after the student answers.
- The title ("Hint", "Why") comes from the shared words. The content is the product's, at 16px with the body line height.
- It rises in one time when it appears. Add it to the page at the moment the student asks for it.
- Put `WorkedSteps` inside `why` to show the steps of a solution.
- The result of an answer ("Correct", "Not yet") is an `AnswerFeedback`, which holds its own reason. `why` is for a reason with no result beside it: a worked example, a review.
