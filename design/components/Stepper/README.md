# Stepper

The steps of a flow, in order, with where the person is: build a practice set, set up a class. `Stepper` in `src/components/Stepper.tsx`.

- Each step is a 32px round mark with its name under it, in equal columns. A done step has a check on a `track` ground; the current step has an ink ring and an ink name; an upcoming step has a hairline ring and is `muted`.
- The line between two marks is ink when the first step is done.
- Three to five steps, each named with one or two words, so the names fit on a phone. A longer name wraps.
- It shows the place. It does not move the person: the page's buttons do that.
- A student's progress through a set is `StepProgress`, not a stepper.
- The current step has `aria-current="step"`, and each mark says its state in words ("Step 1, done").
