# Generating

What Gauth AI shows while it builds something: the steps of the work and the one it is on. `Generating` in `src/learning/Generating.tsx`.

- One line for each step. A done step has a check and is `muted`; the current step has a spinner and is ink at 500; an upcoming step is `muted` with a small empty ring.
- A step says what is being done, with the real thing it works on: "Read the class's readiness results", "Writing Form B". Not "Thinking".
- Two to five steps. Work with one step uses `Spinner` or `Progress`.
- No sparkle, no gradient, no moving text: only the spinner moves.
- It is a `status`. Give it a `label` that names the work ("Building Form B").
