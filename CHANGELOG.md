# Changelog

What changed in each version of `gauth-ui`, newest first. A version is on npm when its number is in `package.json` on `main`.

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
