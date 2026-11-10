# LevelLadder

Where one student stands on the ladder for one skill. `LevelLadder` in `src/learning/LevelLadder.tsx`.

- Four rungs, lowest first: Attempted, Familiar, Proficient, Mastered. Each rung shows its mark and its name.
- The rungs up to the student's level are reached: they have their color, and the line into each one has that rung's color.
- The student's level is the current rung: a larger mark on the level's soft ground, with its name in ink at 500.
- A rung not reached yet keeps its shape, is smaller and has no color.
- Not started is not a rung. With `not_started`, no rung is reached.
- It is an ordered list, and the current rung has `aria-current`.
