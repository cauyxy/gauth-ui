# LevelChip

A skill level as a chip: in a table row, on a skill card, beside a student's name. `LevelChip` in `src/learning/LevelChip.tsx`.

- The level's mark and its name. The name comes from the shared words, so it changes with the language.
- The level's `-ink` text on its `-soft` ground. Not started is `muted` on `surface`.
- 24px high, 6px radius, 12px text at 500: the same box as `Chip`.
- One level chip for one skill. For the count of a class at each level, use `LevelBar`.
