# gauth-ui

The Gauth design system in one place: the tokens, the React components and the design rules. Products install it from npm (`gauth-ui`) and do not keep their own copies.

Read this page before you write or change a component. `design/README.md` says what each color, type size and component means. The existing components are the reference for how to write one.

## Layout

```
src/styles/tokens.css    the tokens (--gx-*). The one source.
src/styles/theme.css     the tokens as a Tailwind v4 theme. Generated.
src/styles/base.css      page defaults, the fallback font, keyframes; in the base layer
src/core/                cn (joins classes; it reads theme-names.ts, generated), the icons, the language: messages.ts (every word, en and es) and locale.tsx;
                         props.ts (the Props type), useControllable.ts (a value the product or the component keeps), refs.ts (mergeRefs)
src/components/          core components: one per file, with its test. A helper stands beside its component: one a server component may call
                         (Segmented.classes.ts, Field.classes.ts), or the parts two components share (DatePicker.parts.tsx, Dialog.parts.tsx)
src/learning/            learning components, same shape
src/math/                Tex and RichText (KaTeX), the entry gauth-ui/math, and math.css
src/styles.css           what a product imports after Tailwind: the tokens, the theme, the base styles, and where Tailwind finds the classes; built to dist/styles.css
src/rules.test.ts        the rules below, checked
src/props.test.tsx       every component passes native props and its ref to one element
src/contrast.test.ts     every allowed text and ground pair reaches 4.5:1
src/docs.test.ts         every size, name and role design/README.md gives is the one in tokens.css; README.md lists every component
gallery/examples/        the examples: one file for each component, each `export function` one example a product can copy
gallery/                 every example on one page, in both languages (pnpm gallery); shot.ts, optical.ts and pixels.ts check it in Chrome;
                         harness.ts is what they share: the server, Chrome, a ready page, the floating components opened
gallery/foundations.tsx  the type scale and the movements, drawn from tokens.css: for the docs site's Tokens page and the artifact
site/                    the docs site (ui.gauthx.app): every component live on the first page, a page for each with its examples and their code first, then the design rules and the tokens
GLOSSARY.md              what each shared word means, in en and es
CHANGELOG.md             what changed in each version, for a product that updates
scripts/token-model.ts   reads tokens.css: each token's name, family, value and notes. Every tool that needs a token reads it here
scripts/tokens.ts        writes theme.css, src/core/theme-names.ts and design/tokens.json from tokens.css
scripts/inventory.ts     the components, from the files in src/: the tests, site/shot.ts and the artifact read the list here
scripts/icons.ts         the list of icons; copies their drawings from Lucide into src/core/icons.ts
compare/                 compares each component with the gauthx one it replaces (pnpm compare)
docs/from-gauthx.md      what changes for gauthx when it switches to this package
design/README.md         the design rules: content, color, type, surfaces
design/components/       one guideline per component
design/tokens.json       the tokens as data, for the docs site's Tokens page. Generated.
artifact/                builds the Design System artifact on claude.ai from all of the above (artifact/README.md)
```

## A component is four files

```
src/components/Button.tsx          the component, with its styles as Tailwind classes
src/components/Button.test.tsx     its test
design/components/Button/README.md when to use it
gallery/examples/Button.tsx        its examples
```

A learning component has the same four files, with the first two under `src/learning/`. Then export it and its props type from `src/index.ts`, add its name to `GROUPS` in `gallery/groups.ts`, to the Components table of `design/README.md` and to the Components lines of `README.md`, and add its line to `src/props.test.tsx`. `scripts/inventory.ts` lists the components from the files in `src/`, and the tests fail when one of these places does not list each of them once. `Button.tsx` is the reference for how the classes are written.

**An example is code a product can copy.** Each `export function` in the example file is one example: the gallery and the docs site draw it, and the site shows its code with the imports written from `gauth-ui`. So an example imports only from `../../src`, `../../src/math` and `react`, keeps its own state, and lays itself out with Tailwind classes as a product would. A helper it needs (a list of options, a small drawing) is a `const` or `function` in the same file that is not exported; the site shows it with the example.

## Styles

- **Tailwind 4 classes, in the component.** The same way as shadcn/ui: utility classes in the TSX, `cva` for variants and sizes, `cn()` (`src/core/cn.ts`) to join them. There is no CSS file for a component and no `@apply`. A product must be on Tailwind 4; it loads the package with `@import 'gauth-ui/styles.css'` after `@import 'tailwindcss'`.
- **A product's `className` wins.** `cn()` puts it last and drops the class it conflicts with: `<Button className="w-full bg-surface">`. So `className` always goes through `cn()`, never through string joining.
- **Whole class names.** Tailwind reads the files as text. Write `bg-good-soft`, never `bg-${tone}-soft`; a variant is a key in a `cva` map with its whole classes.
- **A skill level's color comes from `data-level`.** An element that shows a level sets `data-level={level}`, and it and what is inside it use `bg-level` (the fill), `text-level-ink` (text on the soft ground), `bg-level-soft` and `border-level`. tokens.css sets the three colors of each level in one `[data-level]` block, from the Skill levels table of `design/README.md`; theme.css gives the names. Do not write a level's color by its own name (`bg-familiar-soft`) in a component.
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
- **Every component passes native props and `ref` on.** Its props are `Props<'div', Own>` (`src/core/props.ts`): its own, and those of the element they go to. `className` goes through `cn()`, `style` is merged over the component's own, and the rest is spread on the element: `id`, `data-*`, `aria-*`, the events, `ref`. React 19 gives `ref` as a prop, so there is no `forwardRef`. A component that needs the element itself joins the two refs with `mergeRefs`.
- **For a control inside a wrapper, the native props go to the control.** `Input`, `Select`, `Checkbox`, `Combobox`, `NumberInput`, `FileDropzone` and `Composer` put `className` on the wrapper and everything else, with `ref`, on the `<input>`, `<select>` or `<textarea>`: that is where `name`, `required`, `disabled` and focus belong.
- **A prop is not written twice.** What a native prop already does (`disabled`, `name`, `placeholder`, `title`) is not an own prop. An own prop replaces a native one of the same name (`title`, `onChange`, `size`).
- **The component's props are a named, exported type**: `ButtonProps` beside `Button`, exported from `src/index.ts`.
- **A control with a value works both ways.** `value` (or `checked`, `pressed`) with `onChange(newValue)` when the product keeps the value; `defaultValue` (`defaultChecked`, `defaultPressed`) when the control keeps its own. `useControllable` does it. `onChange` gets the new value, not the event, and is optional. A value that can be empty is `null`: `undefined` means "the control keeps it".
- **A control goes with a form.** With `name` its value is sent: the native element sends it, or a hidden input does (`Switch`, `Segmented`, `Combobox`, `DatePicker`, `DateRangePicker`).
- **The product's handler runs first.** A component that needs an event the product may also want (`onClick` on `Switch`, `onKeyDown` on `Composer`) calls the product's handler, then does its own part unless `event.defaultPrevented`.
- A link that must look like a component uses the class helper (`buttonClass()`, `segmentedOptionClass()`). Do not copy styles.
- No text is fixed in a component. A word the component says by itself ("Loading", "Close", "Not yet", a level name) comes from `useLocale().messages`, so it is the same in every product and it changes with the language. Every other word is a prop.

## Server components

A product on the Next.js App Router imports the package in a server component. So:

- **A file that needs the browser starts with `'use client'`**: one that keeps state, reads a context (`useLocale`, `useField`), runs an effect or sets an event handler. The build writes one file for each source file and keeps the line.
- **A file without the line is drawn on the server**: `Button`, `Panel`, `Prose`, `Table`. It uses no hook but `useId`, and what it imports from a client file is a component or a type, never a function: a server component cannot call a client file's function.
- **A helper a server component may call is not in a client file.** When its component is one, the helper stands beside it: `Segmented.classes.ts`, `Pagination.pages.ts`, `math/text.ts`.
- **Nothing reads `window` or `document` while it draws.** That is for an effect or an event handler.

`rules.test.ts` checks the first three. To check a change in a real project, pack the build (`pnpm pack`) and install the file in a Next.js app.

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
pnpm lint        # oxlint: bugs, React, hooks, accessibility, vitest (.oxlintrc.json); a warning fails too
pnpm format      # oxfmt writes every file; CI runs pnpm format:check
pnpm test        # component tests, rules.test.ts and docs.test.ts
pnpm build       # dist/: one .js and .d.ts for each source file (not minified), styles.css (what a product imports after Tailwind), tokens.css, theme.css
pnpm tokens      # after a change to tokens.css
pnpm icons       # after adding an icon's name to scripts/icons.ts
node gallery/optical.ts          # after a change to a control's size, padding, font or icon: ink alignment, measured in Chrome
node gallery/pixels.ts take <folder>   # before and after a change that must not change the look (how classes are written, a Tailwind upgrade);
node gallery/pixels.ts compare <a> <b> # then every picture that differs: each block, each control hovered and focused, each floating part open
node gallery/shot.ts <folder>    # screenshots of every component, both languages, desktop and phone
node site/shot.ts <folder>       # after a change to site/ or gallery/: screenshots of the docs site, and a check that every component's page shows an example
pnpm artifact                    # the files of the Design System artifact, in artifact/out/; every preview is drawn in Chrome and must draw
pnpm artifact:check              # every preview of the artifact is the gallery's picture, pixel for pixel; with --published <folder>, what the artifact is behind on
```

The tools are oxc's: oxlint lints and oxfmt formats (`.oxlintrc.json`, `.oxfmtrc.json`). Not ESLint: typescript-eslint does not run on TypeScript 7, and oxc needs no TypeScript. A rule that is off in `.oxlintrc.json` is off because the code does that on purpose (a `role` on a `span`, a radio group with a roving tab stop). Turn a rule off for one line with `// oxlint-disable-next-line <rule>` and a comment that says why. oxfmt does not touch Markdown or the generated files (`ignorePatterns`); `// oxfmt-ignore` keeps one statement as written.

## Release

Two things ship from `main`: the package when its version changes, the docs site after each push.

**The package, to npm.** Change `version` in `package.json`, say what changed under that version in `CHANGELOG.md`, and merge. `release.yml` runs when `package.json` changes on `main`: when npm does not have that version yet, it runs the checks through `prepublishOnly`, publishes, and pushes the tag `v<version>` on that commit. Nobody pushes a tag by hand, and a version npm already has is left alone. To run it again after a publish that failed, run `gh workflow run release.yml --ref main`, or Actions → Release → Run workflow on GitHub. npm trusts that workflow by name (the package's Trusted publishing setting on npmjs.com: user `cauyxy`, repository `gauth-ui`, workflow filename `release.yml`, no environment), so do not rename the file. A new setting expires when no publish goes through it within 2 days. When the workflow log says `Skipped OIDC`, npm did not accept the setting and the `NPM_TOKEN` secret published instead. When the trusted publisher does not allow `npm publish`, the version is staged: it is live only after the owner approves it on npmjs.com. Check with `npm view gauth-ui@<version>`.

**The docs site, to ui.gauthx.app.** `ci.yml` checks and builds every pull request and push to `main`. On `main`, the deploy job publishes that run's site artifact to Cloudflare as `gauth-ui-site`; a failed check blocks deployment. To redeploy manually, run `gh workflow run ci.yml --ref main`. It needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets for the account holding `gauthx.app`. The token must allow Workers Scripts Write on the account and zone/DNS access for the custom domain in `site/wrangler.jsonc`.

The site has no content of its own. It reads `README.md`, `design/README.md`, `design/components/*/README.md`, `GLOSSARY.md`, `design/tokens.json` and the gallery, so a change to a rule or a component is on the site at the next deploy. The site is for looking at the components: the first page shows them all, and a component's page shows each example, with its code one click away, before its rules. A new component gets `gallery/examples/<Name>.tsx` and its name in `GROUPS` in `gallery/groups.ts`; `rules.test.ts` fails when either is missing. `pnpm site` serves it locally.
