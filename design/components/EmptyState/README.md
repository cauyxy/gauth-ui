# EmptyState

What a list, a panel or a page shows when it has nothing yet, or when it did not load. `EmptyState` in `src/components/EmptyState.tsx`.

- Centered: a 16px title at 600 in ink, a muted 14px description, then the action. No outline of its own: it sits in a `Panel` or on the page.
- Say what is true now, then give one action: "No practice sent yet" and "Send practice".
- `action` is one `Button`. It is `ink` when it is the main action of the view, and `outline` for "Try again".
- No illustration. `icon` takes one line icon when the place needs a mark.
- A page that did not load is the same component: "This page didn't load", "Check your connection.", "Try again".
