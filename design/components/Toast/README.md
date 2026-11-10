# Toast

One line that says what just happened. `toast()` and `Toaster` in `src/components/Toast.tsx` (Radix).

- A product mounts `<Toaster />` once, near the root. `toast('Published to Period 3', { tone: 'good' })` works from anywhere.
- Ink ground, white 14px text at 500, 12px radius, `shadow-pop`: the same ground as a `Tooltip`. Toasts stack at the bottom center, above everything.
- Tones: `neutral` has no mark, `good` has a check, `warn` has an orange dot. The mark is a shape as well as a color.
- It leaves by itself after 4 seconds, or at once on its dismiss button. The timer stops while the pointer or focus is on it.
- Write what happened and where: "Published to Period 3", "Not saved. Try again." Not "Success".
- Never put the only copy of a fact or an action in a toast. A problem the person must fix stays on the page, as a `Callout` or a field error.
