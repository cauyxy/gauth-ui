# LevelBar

How many are at each level, as one bar: the students of a class for a skill, or the skills of a student. `LevelBar` in `src/learning/LevelBar.tsx`.

- One part for each level, as wide as its share. Mastered is first and Not started is last.
- 8px high, 4px radius, 2px gaps between the parts. A level with a count of 0 has no part.
- When every count is 0, the bar is the empty `track`.
- `label` says what is counted ("Geometry · Period 3"). A screen reader hears the label and then each count: "Proficient: 7".
- Show the total beside the bar as a real count ("28 students"), not as a percent.
- A level bar means skill. For how far along a set is, use `StepProgress`.
