# Skeleton

What a page shows while its data loads. `Skeleton` and `PageSkeleton` in `src/components/Skeleton.tsx`.

- `PageSkeleton` draws a title and panels of rows, so the page takes its shape at once instead of reading "Loading…".
- It fades in after 150 ms, so a page whose data is already on the way never flashes it.
- Bars are `ink` at 7% with an 8px radius and a pulse that stops under reduced motion.
- A single `Skeleton` gets its size from `className` or `style`.
