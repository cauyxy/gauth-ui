# WorkedSteps

A student's work or a solution, one step on each line. `WorkedSteps` in `src/learning/WorkedSteps.tsx`.

- Numbered steps at 14px. A step that is a formula is a `Tex`; a step in plain text is in mono. The numbers are `muted` and stand on the baseline of their step.
- A step with `flag` is the step that went wrong: an `attempted-soft` ground, an `attempted` bar at its start, and the flag text below it in `attempted-ink`.
- The flag names what happened in a few words ("Sign dropped here"). The product writes it. Do not write "Wrong".
- Flag one step: the first one that went wrong.
- The content of a step is the product's: text or a formula.
