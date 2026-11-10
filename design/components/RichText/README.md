# RichText

Words with formulas in them: plain text with TeX between `$...$`. `RichText` in `src/math/RichText.tsx`, imported from `gauth-ui/math`.

- It is the format of a stem, a choice, a hint and an explanation: `"The legs are 6 and 8, so $c^2 = 100$."`
- A money amount is an escaped dollar: `\$13`. It never opens a formula.
- A formula keeps the punctuation that touches it, so a line never starts with a comma. A long formula can still break after an "=" or a "+".
- Words that someone put in TeX (`$\text{slope} = \text{rise over run}$`) are shown as plain words, so they wrap and stay in Google Sans.
- For a reply that streams in, pass `closedMath(text)`: it holds back a formula whose `$` is not closed yet.
