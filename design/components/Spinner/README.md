# Spinner

One action is in progress and will end soon: a file uploads, a button's request runs. `Spinner` in `src/components/Spinner.tsx`.

- An ink arc on a `track` ring, 18px by default. `size` is in pixels.
- It is a `status` named "Loading". Give it a `label` when you know what is loading ("Uploading").
- A page that loads uses `PageSkeleton`, not a spinner. Work with steps uses `Generating`.
- With reduced motion it stands still.
