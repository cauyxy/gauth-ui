# Composer

Where a person writes to Gauth AI. `Composer` in `src/learning/Composer.tsx`.

- A white box with a 16px radius and a control hairline. The text is 16px. The box starts one line high and grows to about six lines, then it scrolls.
- The send button is round and ink, 34px, with an arrow. It is off while the text is empty.
- Enter sends. Shift+Enter makes a new line.
- One line is always under the box: "Review AI output for accuracy. Follow school policies." `note` changes its words. Nothing removes it.
- The placeholder says what to ask about here ("Ask about this step"), not what the assistant is.
- No sparkle, no gradient, no violet button: the box looks like any other field.
