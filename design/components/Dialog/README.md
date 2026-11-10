# Dialog

A question or a short task that takes over the page until the person answers it. `Dialog`, `DialogTrigger`, `DialogClose`, `DialogContent` in `src/components/Dialog.tsx` (Radix).

- White, 24px radius, 24px padding, up to 480px wide, `shadow-pop`, on a scrim of ink at 40%. On a phone it keeps a 16px gutter and scrolls inside.
- `title` is required: it is the question, and it is the dialog's accessible name. `description` is one muted line under it.
- The actions go last in the body, in `DialogActions` (right-aligned, 8px apart): one `ink` button for the answer and a `soft` one to cancel. Wrap the cancel button in `DialogClose`.
- It closes on Escape, on a click on the scrim and on the close button at the top right. Focus stays inside while it is open and returns to what opened it.
- The scrim fades in and the panel pops in. Both leave faster than they arrive.
- Use a dialog when the page must wait for an answer. A hint, a menu or a picker next to a control is a `Popover` or a `Menu`.
