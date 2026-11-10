# Button

The one way to act on a row, card or page. `Button` and `buttonClass` in `src/components/Button.tsx`.

- `ink` for the single primary action in a view; `soft` or `outline` for the rest; `ghost` and `link` for quiet actions.
- Sizes: `sm` 30px, `md` 34px (default), `lg` 40px, `xl` 44px. The heights are the `--gx-h-*` tokens. Text is 14px at 500; `xl` is 16px with a 12px radius.
- Staff pages use `md`. Student pages and touch targets use `xl`.
- An action that moves the person forward (Start, Generate, Publish) may carry a trailing arrow.
- Labels are one or two verbs: "Start", "Reteach", "Send practice". Not "Click here" or "Submit".
- Never red. Never two ink buttons side by side. Violet is never a button.
- A link that must look like a button uses `asChild` or `buttonClass()`. Do not copy the styles.
- It is `type="button"` by default. A form's submit button sets `type="submit"`.
