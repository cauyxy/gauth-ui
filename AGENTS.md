# gauth-ui

The Gauth design system in one place: the tokens, the React components and the design rules. Products install it from npm (`gauth-ui`) and do not keep their own copies.

Read this page before you write or change a component. `design/README.md` says what each color, type size and component means. The existing components are the reference for how to write one.

## Layout

```
src/styles/tokens.css    the tokens (--gx-*). The one source.
src/styles/theme.css     the tokens as a Tailwind v4 theme. Generated.
src/styles/base.css      page defaults, the fallback font, keyframes
src/components/          one component per file, with its styles and test
src/styles.css           imports all of the above; built to dist/styles.css
src/rules.test.ts        the rules below, checked
scripts/tokens.ts        writes theme.css and design/tokens.json from tokens.css
compare/                 compares each component with the gauthx one it replaces (pnpm compare)
docs/from-gauthx.md      what changes for gauthx when it switches to this package
design/README.md         the design rules: content, color, type, surfaces
design/components/       one guideline per component
design/tokens.json       the tokens for the Design System artifact. Generated.
```

## A component is four files

```
src/components/Button.tsx          the component
src/components/button.css          its styles
src/components/Button.test.tsx     its test
design/components/Button/README.md when to use it
```

Then export it from `src/index.ts` and import its CSS in `src/styles.css`. `rules.test.ts` fails when one of these is missing.

## Styles

- **Plain CSS.** No Tailwind classes, no CSS-in-JS. A product without Tailwind must get the same result.
- **Class names:** `gx-<component>` for the root, `gx-<component>__<part>` for a part, `gx-<component>--<variant>` for a variant or size.
- **State is an attribute** in a component: `aria-checked`, `aria-current`, `:disabled`, `data-*`. A class helper for links cannot set an attribute, so it gives a state class (`gx-segmented__option--on`).
- **No cascade layers.** A component's class must win over a product's own element rules (`button { color: inherit }`), and a layered rule loses to any rule that is not in a layer. A Tailwind product puts the whole file in a layer when it imports it (`@import 'gauth-ui/styles.css' layer(components)`), so its utilities win: `className="w-full"` works.
- **Tokens only.** Colors, type sizes, shadows and durations are `var(--gx-*)`. No hex, no `rgb()`, no literal `font-size`. If a value is missing, add a token to `tokens.css` and run `pnpm tokens`. Do not write the literal.
- **Hover goes inside `@media (hover: hover)`.**
- **Reset what the browser adds.** A product without Tailwind has no CSS reset: a `<button>` sets its own `border`, `padding`, `background`, `font` and `margin`.
- **Motion uses the motion tokens.** A duration is `var(--gx-dur-fast | base | enter | mark)`, an easing is `var(--gx-ease-standard | enter)`, and a named movement is `var(--gx-animate-*)`. No literal `150ms` or `2s`. Reduced motion is handled once: `--gx-ms` becomes 0, so do not write a `prefers-reduced-motion` query in a component. A loop then stops, so give its element a still state that reads correctly.

## Props

- `variant` for the look, `tone` for a color meaning, `size` for a named size.
- **Control sizes are `sm | md | lg | xl`** and take their height from `--gx-h-*` (30, 34, 40, 44px). Do not add a height that is not a token.
- A pixel `size` number is only for marks that scale freely: `Avatar`, `IconBox`, `Dot`.
- A control with a value takes `value` (or `checked`) and `onChange(newValue)`. `onChange` gets the new value, not the event.
- `className` goes to the root element. Other native props spread to the root when it is a native element.
- A link that must look like a component uses the class helper (`buttonClass()`, `segmentedOptionClass()`). Do not copy styles.
- No text is fixed in a component. A default label is a prop default (`label = 'Loading'`).

## Accessibility

- Use the native element: a button is `<button type="button">`, a link is `<a>`.
- A control with no visible text needs a `label` prop for its accessible name.
- Do not remove the focus ring. Color is never the only signal.
- Floating content (tooltip, popover) is built on Radix. Do not write a new focus trap or positioner.

## The look does not change here by accident

The components were moved from the gauthx apps with identical computed styles. A change to how a component looks is a design decision: get the owner's OK, then change the component, its guideline and the token together.

## Two groups

- **core** (`src/components/`): what any product needs. Buttons, fields, panels, overlays, feedback.
- **learning** (`src/learning/`, not started): what an education product shows. Skill levels, a question and its feedback, worked steps, progress through a set, the Gauth AI composer.

learning imports core. core never imports learning.

A learning component owns the shared vocabulary: the level names and colors, and words such as "Not yet". They are prop defaults from one module, so every product says the same thing. It takes content (a stem, a formula, a figure) as children and has no dependency on a math renderer or on a product's data types.

## What does not belong here

A page, a flow, or a component that carries one product's data (a roster, a print sheet, a district table) stays in that product. So do product words: skill names, course content, class names.

## Checks

```bash
pnpm typecheck
pnpm test        # component tests and rules.test.ts
pnpm build       # dist/: index.js, types, styles.css, tokens.css, theme.css
pnpm tokens      # after a change to tokens.css
```

## Release

Change `version` in `package.json`, merge, then push a tag `v<version>`. `release.yml` publishes to npm.
