# gauth-ui

The Gauth design system in one place: the tokens, the React components and the design rules. Products install it from npm (`gauth-ui`) and do not keep their own copies.

Read this page before you write or change a component. `design/README.md` says what each color, type size and component means. The existing components are the reference for how to write one.

## Layout

```
src/styles/tokens.css    the tokens (--gx-*). The one source.
src/styles/theme.css     the tokens as a Tailwind v4 theme. Generated.
src/styles/base.css      page defaults, the fallback font, keyframes
src/core/                cx, the icons, the language: messages.ts (every word, en and es) and locale.tsx
src/components/          core components: one per file, with its styles and test
src/learning/            learning components, same shape
src/math/                Tex and RichText (KaTeX), the entry gauth-ui/math, and math.css
src/styles.css           imports all of the above; built to dist/styles.css
src/rules.test.ts        the rules below, checked
src/contrast.test.ts     every allowed text and ground pair reaches 4.5:1
gallery/                 every component on one page, in both languages (pnpm gallery); shot.ts and optical.ts check it in Chrome
site/                    the docs site (ui.gauthx.app): the design rules, the tokens and the gallery's examples with each guideline
GLOSSARY.md              what each shared word means, in en and es
scripts/tokens.ts        writes theme.css and design/tokens.json from tokens.css
scripts/icons.ts         the list of icons; copies their drawings from Lucide into src/core/icons.ts
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

A learning component has the same four files, under `src/learning/`. Then export it from `src/index.ts`, import its CSS in `src/styles.css` and show it in `gallery/`. `rules.test.ts` fails when one of these is missing.

## Styles

- **Plain CSS.** No Tailwind classes, no CSS-in-JS. A product without Tailwind must get the same result.
- **Class names:** `gx-<component>` for the root, `gx-<component>__<part>` for a part, `gx-<component>--<variant>` for a variant or size.
- **State is an attribute** in a component: `aria-checked`, `aria-current`, `:disabled`, `data-*`. A class helper for links cannot set an attribute, so it gives a state class (`gx-segmented__option--on`).
- **No cascade layers.** A component's class must win over a product's own element rules (`button { color: inherit }`), and a layered rule loses to any rule that is not in a layer. A Tailwind product puts the whole file in a layer when it imports it (`@import 'gauth-ui/styles.css' layer(components)`), so its utilities win: `className="w-full"` works.
- **Tokens only.** Colors, type sizes and weights, shadows and durations are `var(--gx-*)`. A `box-shadow` is a shadow token, never a value written in the component. No hex, no `rgb()`, no literal `font-size`. If a value is missing, add a token to `tokens.css` and run `pnpm tokens`. Do not write the literal.
- **Spacing is on the scale.** `padding`, `margin` and `gap` are `var(--gx-space-*)` (2 to 40px), `0`, `auto`, or a `calc()` of them. `line-height` is `var(--gx-leading-*)`, `letter-spacing` is `var(--gx-tracking-*)`, and `z-index` is `var(--gx-z-overlay | pop | toast)` (`0` and `1` are for stacking inside one component).
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
- No text is fixed in a component. A word the component says by itself ("Loading", "Close", "Not yet", a level name) comes from `useLocale().messages`, so it is the same in every product and it changes with the language. Every other word is a prop.

## Language

- `src/core/messages.ts` holds every string, typed by `Messages`, for `en` and `es`. To add one: add the key to `Messages`, fill it in for both languages, and add the term to `GLOSSARY.md` when it is a product word.
- A product sets the language once with `<LocaleProvider locale="es">`. Without it, components speak English.
- Dates and deltas use `useLocale().formatDay` and `formatDelta`, not a format written in a component.
- Text length changes with the language: do not fix a width around a word, and let a label wrap or truncate.

## Accessibility

- Use the native element: a button is `<button type="button">`, a link is `<a>`.
- A control with no visible text needs a `label` prop for its accessible name. A button that shows only an icon is an `IconButton`.
- Text only a screen reader needs (who wrote a message) has the class `gx-visually-hidden`.
- **Focus is one ring.** Every control that takes a click shows `outline: var(--gx-focus-ring)` on `:focus-visible` (2px blue), with `outline-offset` 1 or 2px. No other focus style. On an ink ground the ring is white (`outline-color`), because blue on ink is under 3:1. A small button inside a control (a chip's remove, a toast's dismiss) draws the ring inside itself, so it does not cover the text beside it.
- **A group is one Tab stop.** Inside a radio group, a tab list or a menu, the arrow keys move and Tab leaves.
- **Text reaches 4.5:1.** `src/contrast.test.ts` lists the allowed pairs. Text on a level's fill or on `correct` is ink, never white. `faint` and `good-mid` are not text colors.
- Color is never the only signal: a state also has a shape, a mark or a word.
- Floating content (tooltip, popover, dialog, menu, toast) is built on Radix. Do not write a new focus trap or positioner.

## The look does not change here by accident

A change to how a component looks is a design decision: get the owner's OK, then change the component, its guideline and the token together. The components started as copies of the gauthx ones; `docs/from-gauthx.md` lists every difference since.

## Two groups

- **core** (`src/components/`): what any product needs. Buttons, fields, panels, overlays, feedback.
- **learning** (`src/learning/`): what an education product shows. Skill levels, a question and its feedback, worked steps, progress through a set, the Gauth AI composer.

learning imports core. core never imports learning.

A learning component owns the shared vocabulary: the level names and colors, and words such as "Not yet". They come from `messages.ts`, so every product says the same thing. It takes content (a stem, a formula, a figure) as children and has no dependency on a product's data types.

**math** (`src/math/`) is a third, small group with its own entry: `gauth-ui/math` and `gauth-ui/math.css`. It holds `Tex` and `RichText`, on KaTeX. It is apart so that a product with no formulas does not load KaTeX and its fonts. core and learning do not import it: a formula comes to them as children.

## What does not belong here

A page, a flow, or a component that carries one product's data (a roster, a print sheet, a district table) stays in that product. So do product words: skill names, course content, class names.

## Checks

```bash
pnpm typecheck
pnpm test        # component tests and rules.test.ts
pnpm build       # dist/: index.js, types, styles.css, tokens.css, theme.css
pnpm tokens      # after a change to tokens.css
pnpm icons       # after adding an icon's name to scripts/icons.ts
node gallery/optical.ts          # after a change to a control's size, padding, font or icon: ink alignment, measured in Chrome
node gallery/shot.ts <folder>    # screenshots of every component, both languages, desktop and phone
```

## Release

Two things ship, each by hand, each from `main`.

**The package, to npm.** Change `version` in `package.json`, merge, then push a tag `v<version>`. `release.yml` runs the checks through `prepublishOnly` and publishes. It needs the `NPM_TOKEN` repository secret.

**The docs site, to ui.gauthx.app.** Run the `site` workflow (Actions → site → Run workflow, or `gh workflow run site`). It builds `site/` and deploys it to Cloudflare as the Worker `gauth-ui-site` (`site/wrangler.jsonc`). It needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets, the same account that holds the `gauthx.app` zone.

The site has no content of its own. It reads `README.md`, `design/README.md`, `design/components/*/README.md`, `GLOSSARY.md`, `design/tokens.json` and the gallery, so a change to a rule or a component is on the site at the next deploy. A new component goes into `GROUPS` in `site/content.ts`; `rules.test.ts` fails when one is missing. `pnpm site` serves it locally.
