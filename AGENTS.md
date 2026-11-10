# gauth-ui

The Gauth design system in one place: the tokens, the React components and the design rules. Products install it from npm (`gauth-ui`) and do not keep their own copies.

Read this page before you write or change a component. `design/README.md` says what each color, type size and component means. The existing components are the reference for how to write one.

## Layout

```
src/styles/tokens.css    the tokens (--gx-*). The one source.
src/styles/theme.css     the tokens as a Tailwind v4 theme. Generated.
src/styles/base.css      page defaults, the fallback font, keyframes; in the base layer
src/core/                cn (joins classes), the icons, the language: messages.ts (every word, en and es) and locale.tsx
src/components/          core components: one per file, with its test
src/learning/            learning components, same shape
src/math/                Tex and RichText (KaTeX), the entry gauth-ui/math, and math.css
src/styles.css           what a product imports after Tailwind: the tokens, the theme, the base styles, and where Tailwind finds the classes; built to dist/styles.css
src/rules.test.ts        the rules below, checked
src/contrast.test.ts     every allowed text and ground pair reaches 4.5:1
gallery/                 a block of examples for each component, all on one page, in both languages (pnpm gallery); shot.ts, optical.ts and pixels.ts check it in Chrome
site/                    the docs site (ui.gauthx.app): every component live on the first page, a page for each with its examples first, then the design rules and the tokens
GLOSSARY.md              what each shared word means, in en and es
scripts/tokens.ts        writes theme.css and design/tokens.json from tokens.css
scripts/icons.ts         the list of icons; copies their drawings from Lucide into src/core/icons.ts
compare/                 compares each component with the gauthx one it replaces (pnpm compare)
docs/from-gauthx.md      what changes for gauthx when it switches to this package
design/README.md         the design rules: content, color, type, surfaces
design/components/       one guideline per component
design/tokens.json       the tokens for the Design System artifact. Generated.
```

## A component is three files

```
src/components/Button.tsx          the component, with its styles as Tailwind classes
src/components/Button.test.tsx     its test
design/components/Button/README.md when to use it
```

A learning component has the same three files, under `src/learning/`. Then export it from `src/index.ts` and show it in `gallery/`. `rules.test.ts` fails when one of these is missing. `Button.tsx` is the reference for how the classes are written.

## Styles

- **Tailwind 4 classes, in the component.** The same way as shadcn/ui: utility classes in the TSX, `cva` for variants and sizes, `cn()` (`src/core/cn.ts`) to join them. There is no CSS file for a component and no `@apply`. A product must be on Tailwind 4; it loads the package with `@import 'gauth-ui/styles.css'` after `@import 'tailwindcss'`.
- **A product's `className` wins.** `cn()` puts it last and drops the class it conflicts with: `<Button className="w-full bg-surface">`. So `className` always goes through `cn()`, never through string joining.
- **Whole class names.** Tailwind reads the files as text. Write `bg-good-soft`, never `bg-${tone}-soft`; a variant is a key in a `cva` map with its whole classes.
- **A `gx-` name stays on each element**: `gx-<component>` for the root, `gx-<component>__<part>` for a part, `gx-<component>--<variant>` for a variant or size. It carries no styles. Tests, `gallery/optical.ts` and a product's own tools find the element by it.
- **State is an attribute**, styled with a variant: `aria-checked:`, `aria-[current=page]:`, `disabled:`, `data-[state=open]:`. A parent's state reaches a child with `group` and `group-data-[…]:`. When two states can be true at once, the one that must win is written so it does (a `cva` compound variant, or a more specific variant such as `aria-pressed:hover:`): the order of classes in the source does not decide.
- **Tokens only.** A color, type size, weight, radius or shadow is a theme name from `theme.css`: `bg-ink`, `text-sm`, `font-control`, `rounded-lg`, `shadow-edge`. A control height is `h-(--gx-h-md)`. No `text-[13px]`, no `bg-[#…]`, no `font-semibold`, no `shadow-[…]`, no `ring-*`. If a value is missing, add a token to `tokens.css` and run `pnpm tokens`.
- **Spacing is on the scale.** Padding, margin and gap take `0 0.5 1 1.5 2 2.5 3 3.5 4 5 6 8 10` (2 to 40px), `px`, `auto`, or `[calc(…)]` of the space tokens. `leading-` is `figure | title | heading | body | normal`, `tracking-` is `display | title | label | normal`, and `z-` is `z-(--gx-z-overlay | pop | toast)` (`z-0` and `z-1` are for stacking inside one component). A size that is not spacing (a 18px mark, a 1.5px border) is written with its unit: `size-[18px]`.
- **Hover is the `hover:` variant.** Tailwind gives it to devices that can hover only. Never `[&:hover]:`.
- **Tailwind's reset is there.** Every product has Preflight: margins are 0, borders are `0 solid`, buttons inherit their font, every box is `border-box`, also `::before` and `::after`. Do not write those resets again.
- **Motion uses the motion tokens.** A duration is `duration-(--gx-dur-fast | base | enter | mark)`, always written beside a `transition-*` class (Tailwind's own default is a literal 150ms). An easing is `ease-standard` or `ease-enter`, and a named movement is `animate-*` from the theme. Reduced motion is handled once: `--gx-ms` becomes 0, so do not write `motion-reduce:`. A loop then stops, so give its element a still state that reads correctly.
- **What classes cannot say stays in CSS, in one place.** `src/styles/base.css` (page defaults, the fallback font, keyframes, `gx-visually-hidden`) is imported into the base layer, so every utility wins over it. `src/math/math.css` styles KaTeX's own markup and stays plain CSS.

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
- **Focus is one ring.** Every control that takes a click has `outline-0 focus-visible:focus-ring` (2px blue, `--gx-focus-ring`), with `focus-visible:outline-offset-1` or `-2`. No other focus style, and no `ring-*`. On an ink ground the ring is white (`focus-visible:outline-white`), because blue on ink is under 3:1. A small button inside a control (a chip's remove, a toast's dismiss) draws the ring inside itself, so it does not cover the text beside it.
- **A group is one Tab stop.** Inside a radio group, a tab list or a menu, the arrow keys move and Tab leaves.
- **Text reaches 4.5:1.** `src/contrast.test.ts` lists the allowed pairs. Text on a level's fill or on `correct` is ink, never white. `faint` and `good-mid` are not text colors.
- Color is never the only signal: a state also has a shape, a mark or a word.
- Floating content (tooltip, popover, dialog, menu, toast) is built on Radix. Do not write a new focus trap or positioner.

## The look does not change here by accident

A change to how a component looks is a design decision: get the owner's OK, then change the component, its guideline and the token together. The components started as copies of the gauthx ones; `docs/from-gauthx.md` lists every difference since. A change that only rewrites classes proves it with `gallery/pixels.ts`: the pictures before and after are the same, pixel for pixel.

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
pnpm build       # dist/: index.js, types, styles.css (what a product imports after Tailwind), tokens.css, theme.css
pnpm tokens      # after a change to tokens.css
pnpm icons       # after adding an icon's name to scripts/icons.ts
node gallery/optical.ts          # after a change to a control's size, padding, font or icon: ink alignment, measured in Chrome
node gallery/pixels.ts take <folder>   # before and after a change that must not change the look (how classes are written, a Tailwind upgrade);
node gallery/pixels.ts compare <a> <b> # then every picture that differs: each block, each control hovered and focused, each floating part open
node gallery/shot.ts <folder>    # screenshots of every component, both languages, desktop and phone
node site/shot.ts <folder>       # after a change to site/ or gallery/: screenshots of the docs site, and a check that every component's page shows an example
```

## Release

Two things ship from `main`: the package on a version tag, the docs site after each push.

**The package, to npm.** Change `version` in `package.json`, merge, then push a tag `v<version>`. `release.yml` runs the checks through `prepublishOnly` and publishes. npm trusts that workflow by name (the package's Trusted publisher setting on npmjs.com names `cauyxy/gauth-ui` and `release.yml`), so do not rename the file. When the trusted publisher does not allow `npm publish`, the version is staged: it is live only after the owner approves it on npmjs.com. Check with `npm view gauth-ui@<version>`.

**The docs site, to ui.gauthx.app.** `ci.yml` checks and builds every pull request and push to `main`. On `main`, the deploy job publishes that run's site artifact to Cloudflare as `gauth-ui-site`; a failed check blocks deployment. To redeploy manually, run `gh workflow run ci.yml --ref main`. It needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets for the account holding `gauthx.app`. The token must allow Workers Scripts Write on the account and zone/DNS access for the custom domain in `site/wrangler.jsonc`.

The site has no content of its own. It reads `README.md`, `design/README.md`, `design/components/*/README.md`, `GLOSSARY.md`, `design/tokens.json` and the gallery, so a change to a rule or a component is on the site at the next deploy. The site is for looking at the components: the first page shows them all, and a component's page shows its examples before its rules. A new component gets one `<Section title="Name">` in `gallery/` and its name in `GROUPS` in `site/content.ts`; `rules.test.ts` fails when either is missing. `pnpm site` serves it locally.
