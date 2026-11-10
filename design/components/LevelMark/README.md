# LevelMark

The small mark of a skill level, beside the level's name or in a tight row. `LevelMark` in `src/learning/LevelMark.tsx`.

- Each level has its own shape and its own color: Mastered is a full disc, Proficient is three quarters, Familiar is a half, Attempted is a ring, Not started is a dash.
- 14px by default. `size` is in pixels.
- It is decoration: the level's name sits beside it. When no name is beside it, set `label` and the mark says the name itself.
- The shapes and colors are the same in every product. Do not draw a level another way.
