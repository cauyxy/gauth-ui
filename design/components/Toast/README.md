# Toast

One line that says what just happened. `toast()` and `Toaster` in `src/components/Toast.tsx` (Radix).

- A product mounts `<Toaster />` once, near the root. `toast('Published to Period 3', { tone: 'good' })` works from anywhere.
- Ink ground, white 14px text at 500, 12px radius, `shadow-pop`: the same ground as a `Tooltip`. Toasts stack at the bottom center, above everything.
- Tones: `neutral` has no mark, `good` has a check, `warn` has an orange dot. The mark is a shape as well as a color.
- `description` is a second line under the message: 12px, white at 72%. Use it for what or where ("Exit ticket · Geometry · Period 3"), not for a second sentence. With it, the mark stays on the first line.
- `action` is one button after the text: `{ label, onClick }`, underlined white text. It takes back what just happened ("Undo"), in one word. Pressing it runs `onClick` and closes the toast.
- It leaves by itself after 4 seconds, or after 8 when it has an action, or at once on its dismiss button. The timer stops while the pointer or focus is on it.
- The same toast is on screen once. A `toast()` with the words and tone of one that is still there takes its place: it moves to where the newest stands and its 4 seconds start again. Five presses on "Copy link" are one "Link copied". Toasts that say different things still stack.
- A toast with an action is never taken away by another, also when two say the same: each "Undo" takes back its own thing.
- Write what happened and where: "Published to Period 3", "Not saved. Try again." Not "Success".
- Never put the only copy of a fact in a toast, and never an action the person must take. A problem the person must fix stays on the page, as a `Callout` or a field error.
