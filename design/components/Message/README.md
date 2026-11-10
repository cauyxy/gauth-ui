# Message

One turn of a conversation with Gauth AI. `Message` in `src/learning/Message.tsx`.

- `user` is a `surface` bubble at the end side, as wide as its text, at most 85% of the column. `ai` has no bubble: the reply is plain text across the column.
- No avatar, no sparkle and no name above each turn. The side and the bubble say who wrote it; a screen reader hears "You" or "Gauth AI" first.
- The text takes the page's size: 14px on a staff page, 16px on a student page.
- Each direct child is one row, 8px apart. Put a run of words in one element (a `<p>` or `RichText`), then a file card, an `AiStatus` line or `ReplyActions`.
- A reply that came from the class's data says so in an `AiStatus` line ("Read 28 answers in Period 3"), not in praise of the answer.
