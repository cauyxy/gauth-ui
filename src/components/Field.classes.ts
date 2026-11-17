/*
 * The box of a field: what every text field, select and date field shares. Each control adds its ground, its edge, its
 * size and its padding. An error is an attempted outline on the attempted-soft ground, the look of "Not yet"; the Field's
 * error text says what is wrong. Field.tsx is a client file, so the classes stand beside it.
 */

/** On the control itself: `Input`, `Textarea`, `Select`, `Combobox`, the button of `DatePicker` and `DateRangePicker`. */
export const fieldBox =
  'w-full text-ink outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-1 disabled:opacity-50 aria-invalid:bg-attempted-soft aria-invalid:shadow-invalid'

/** On a box around the control (`NumberInput`, with its buttons inside): the same look, from the state of the input in it. */
export const fieldBoxAround =
  'text-ink transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard has-[input:focus-visible]:focus-ring has-[input:focus-visible]:outline-offset-1 has-[input:disabled]:opacity-50 has-[input[aria-invalid=true]]:bg-attempted-soft has-[input[aria-invalid=true]]:shadow-invalid'
