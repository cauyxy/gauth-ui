# Composer

Where a person writes to Gauth AI. `Composer` in `src/learning/Composer.tsx`.

- A white box with a 16px radius and a control hairline. The text is 16px. The box starts one line high and grows to about six lines, then it scrolls.
- The send button is round and ink, 34px, with an arrow. It is off while the text is empty.
- Enter sends. Shift+Enter makes a new line.
- `before` is rows inside the box above the text: a `Quote`, the files a person attached. They keep to the box's padding.
- `tools` is `IconButton`s at the start of a bottom row: attach, microphone. With tools the box has two rows, the text on top, then the tools and Send. Without tools it is one row.
- While Gauth AI writes (`busy`), Send becomes Stop: a filled square in the same round button, on also when the text is empty. Enter does not send, and the person can still write the next message.
- One line is always under the box: "Review AI output for accuracy. Follow school policies." `note` changes its words. Nothing removes it.
- The placeholder says what to ask about here ("Ask about this step"), not what the assistant is.
- No sparkle, no gradient, no violet button: the box looks like any other field.
