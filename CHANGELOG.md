# Changelog

What changed in each version of `gauth-ui`, newest first. A version is on npm when its number is in `package.json` on `main`.

## 0.4.0

The parts behind the components each have one home: the tokens, the list of components, the box of a field, the date pickers, the colors of a skill level and the frame of a dialog. The look does not change: every picture of `gallery/pixels.ts` is the same as before, pixel for pixel.

### Breaking

- **`useField` returns props to spread.** It returned the Field's `{ id, labelId, describedBy, invalid }`, or `undefined` outside a Field. It is now `useField(label, id)` and returns `{ props, labelId }`: spread `props` on the element that takes focus. Inside a Field they are its `id`, `aria-describedby` and `aria-invalid`; outside one, `label` is the accessible name. `FieldControl` is the new shape.
- **Inside a Field, a control's own `label` is not used.** `Input`, `Textarea`, `Select`, `Combobox` and `NumberInput` set `aria-label` from `label` also inside a `Field`, over the Field's label. The Field's label is now the name, as it already was for `DatePicker` and `DateRangePicker`.
- **`Calendar` no longer takes `range`.** It marked a range for `DateRangePicker`; a calendar alone picks one day.

### Added

- **`DateRangePicker` goes with a form.** With `name` it sends the range as `2026-11-02/2026-11-13`: both days as YYYY-MM-DD, joined by a slash (an ISO 8601 interval), and an empty value before a range is picked. Before, `name` reached the button and a form got nothing.
- **A skill level's colors as utilities.** On an element with `data-level` (and inside it), `bg-level`, `text-level-ink`, `bg-level-soft` and `border-level` are that level's colors. tokens.css sets them for each level, from the Skill levels table of the design rules. A product that shows a level its own way can use them.

### Changed

- `Input`, `Textarea`, `Select`, `Combobox` and `NumberInput` always have an `id`, also outside a `Field`.
- `cn()` reads the theme's names from `theme-names.ts`, which `pnpm tokens` writes from tokens.css. It joins classes as before.

## 0.3.9

The components are written the way React 19 expects. The look does not change: every picture of `gallery/pixels.ts` is the same as before, pixel for pixel.

### Breaking

- **The built files moved.** `dist/` has one file for each source file, not one bundle, and the math entry is `dist/math/index.js`. Import from `gauth-ui` and `gauth-ui/math` as before: those did not change. A path into `dist/` that a product wrote by hand no longer exists.

No prop was taken away. Props that only repeated a native one (`disabled`, `name`, `placeholder`, `title`) are no longer in a component's own list, and reach the element as native props.

### Added

- **Server components.** Each file that needs the browser starts with `'use client'`, and the build keeps the line. The package can be imported in a server component of a Next.js App Router project. Files with no state and no handlers (`Button`, `Panel`, `Prose`, `Table` and more) are drawn on the server, and `buttonClass`, `segmentedOptionClass`, `segmentedTrackClass`, `pagesOf`, `initialsOf`, `fillOf` and `cx` can be called there.
- **Native props and `ref` on every component.** `id`, `style`, `data-*`, `aria-*`, the events and `ref` reach the component's element. Before, 44 component files took a fixed list of props. For a control inside a wrapper (`Input`, `Select`, `Checkbox`, `Combobox`, `NumberInput`, `FileDropzone`, `Composer`), `className` goes to the wrapper and the rest, with `ref`, to the control.
- **Uncontrolled use.** `Select`, `Checkbox`, `Switch`, `ChipToggle`, `Slider`, `RadioGroup`, `Segmented`, `Combobox`, `NumberInput`, `DatePicker`, `DateRangePicker`, `Calendar`, `AnswerGroup` and `Composer` keep their own value when `value` is left out, starting at `defaultValue` (`defaultChecked`, `defaultPressed`). `onChange` is optional.
- **Form names.** `Checkbox`, `Switch`, `Segmented` and `Combobox` take `name` and send their value with a form, as `RadioGroup`, `Slider` and `DatePicker` already did.
- **Props types.** Every component exports its props: `ButtonProps`, `SelectProps<T>`, `ComposerProps`. Also new: `InputSize`, `InputVariant`, `TextareaSize`, `SelectSize`, `SelectOption`, `ToastOptions`, `ToastAction`, `IconProps`, `LocaleProviderProps`.
- **`useField` and `FieldControl`**, so a product's own control can take its label, hint and error from a `Field`.
- **`cn()`**, which joins classes the way the components do: of two Tailwind classes for one property, the later stays. For a product's own components on the tokens.
- **The product's handler runs first.** `Switch` and `ChipToggle` take `onClick`, and `Segmented`, `Combobox`, `AnswerGroup` and `Composer` take `onKeyDown`. It runs before the component's own part, and `event.preventDefault()` stops that part.
- **`Composer` gives out its text box**: `ref` is the `<textarea>`, and `maxLength`, `onPaste` and the other native props reach it.

### Changed

- **A product's bundle keeps only what it imports.** A page that imports `Button` alone carried 22.8 kB of the package; it now carries 2.4 kB.
- **Names are not shortened in the build.** React DevTools shows `Button`, not `ve`. A product minifies its own bundle.
- **The contexts have names** in React DevTools: `Locale`, `Field`, `AnswerGroup`.

### Fixed

- **A product on Node 22 installs without a warning.** The package asked for Node 24 in `engines`, which a product's package manager applies to the product. Node 24 is needed to work on the package, not to use it, so it is in `devEngines` now.

- **`AnswerGroup`: Tab reaches the options when they are inside a wrapper.** The first option was found among the group's direct children only, so with wrapped options and no pick, no option could take focus from the keyboard.

## 0.3.3

The README, the package description and the docs site say that gauth-ui is unofficial and not affiliated with Gauth. The first version published with a provenance statement.

## 0.3.1

The license is MIT. Earlier versions are `UNLICENSED`.
