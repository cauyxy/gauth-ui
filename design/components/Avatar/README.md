# Avatar

A person's initials on a soft gradient. `Avatar` in `src/components/Avatar.tsx`.

- Titles don't count toward initials: "Ms. Carter" is C, "Rachel Carter" is RC.
- The gradient is one of the six `--gx-avatar-*` fills, picked by a hash of the name, so a person has the same color everywhere.
- `size` is in pixels (30 by default). The initials are 38% of it.
- `plain` draws grey initials on `surface-2`.
- Never a cartoon or a photo on school surfaces.
