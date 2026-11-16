# FileDropzone

A place to drop files, or to click and choose them. `FileDropzone` in `src/components/FileDropzone.tsx`.

- White, 16px radius, a 1.5px dashed `ring` edge, 32px of space above and below. A round `track` ground holds the upload icon, then the title at 14px 500, then the hint in 12px `muted`. All of it is centered.
- On hover, and while files are dragged over it, the ground is `surface`; while files are over it, the edge is ink.
- `title` says what to add, in the product's words ("Add a photo of the student's work"). Without one it says "Drop files here, or click to choose".
- `hint` says what is allowed: the kinds and the size ("PDF or a photo, up to 10 MB").
- `accept` lists what is allowed, as on a file input (".pdf,image/*"). Dropped files it does not allow are left out. Without `multiple` it gives one file.
- `onChange` gets the files. Show them under the zone, each as a `Chip` with `onRemove`; the zone itself does not list them.
- The whole zone is one label around the native file input, so Tab reaches it, Enter or Space opens the picker, and the ring is drawn around the zone.
- On a phone, a click opens the camera or the photo library, so the hint should not say "drop".
