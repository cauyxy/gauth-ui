# StepProgress

How far a student is through a set. `StepProgress` in `src/learning/StepProgress.tsx`.

- A `Progress` bar and the count after it: "2 of 6". The count comes from the shared words ("2 de 6" in Spanish), never "2/6" or a percent.
- `done` is the number of finished problems. `label` names the set for a screen reader ("Practice set").
- Progress is ink, never a level color: a level bar means skill, progress means how far along.
