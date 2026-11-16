# Avatar

A person's initials on a soft ground. `Avatar` in `src/components/Avatar.tsx`.

- Titles don't count toward initials: "Ms. Carter" is C, "Rachel Carter" is RC.
- The ground is one of five soft grounds of the palette (`blue-soft`, `violet-soft`, `good-soft`, `warn-soft`, `pink-soft`), with the initials in that ground's own text color. A hash of the name picks it, so a person has the same color everywhere.
- The color tells people apart in a list and means nothing else. It is never a level's color, and there is no gradient.
- `size` is in pixels (30 by default). The initials are 38% of it, at 600.
- `plain` draws grey initials on `surface`.
- Never a cartoon or a photo on school surfaces.
