# gauth-ui

The Gauth design system: tokens, React components and the design rules they follow. White ground, ink text, hairline-edged cards instead of drop shadows, and the red Gauth mark as the only red on the page.

The design rules ship with the package: [`design/README.md`](design/README.md) says what each color, type size and component means.

## Install

```bash
pnpm add gauth-ui
```

React 19 is a peer dependency. Load Google Sans in the page's `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" />
```

## Use

Import the styles once, then the components:

```tsx
import 'gauth-ui/styles.css'
import { Button, Chip, Panel, PanelHeader } from 'gauth-ui'

export function NeedsSupport() {
  return (
    <Panel>
      <PanelHeader title="Needs support">
        <Button variant="outline">Reteach</Button>
      </PanelHeader>
      <Chip tone="blue">A-REI.B.3</Chip>
    </Panel>
  )
}
```

No Tailwind is needed. Every token is a CSS variable (`var(--gx-color-ink)`, `var(--gx-radius-2xl)`, `var(--gx-h-md)`) for your own styles.

The stylesheet also sets page defaults: the font, text color and line height on `html`, no margin and a white ground on `body`, and links and buttons that inherit their color. Component classes win over your own element rules such as `button { … }`.

## With Tailwind v4

Add the theme to get the tokens as utilities (`bg-ink`, `text-muted`, `rounded-2xl`, `shadow-edge`). Tailwind's own palette, type sizes and shadows are cleared, so only Gauth's exist.

```css
@import 'tailwindcss';
@import 'gauth-ui/theme.css';
@import 'gauth-ui/styles.css' layer(components);
```

Import the styles in CSS with `layer(components)`, not from JavaScript. A utility on a component then wins: `<Button className="w-full">`.

## Formulas

Formulas are drawn by KaTeX, from their own entry, so a product with no math does not load it:

```tsx
import 'gauth-ui/math.css'
import { RichText, Tex } from 'gauth-ui/math'

<RichText text="The legs are 6 and 8, so $c^2 = 100$." />
<Tex display tex="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
```

## Language

Components speak English by default. Set the language once, at the root:

```tsx
import { LocaleProvider } from 'gauth-ui'

<LocaleProvider locale="es">…</LocaleProvider>
```

`en` and `es` ship with the package. [`GLOSSARY.md`](GLOSSARY.md) lists the shared words and what each means.

## Components

**Core.** Avatar · Breadcrumbs · Button · Callout · Checkbox · Chip · Dialog · Dot · EmptyState · Field · IconBox · Input · Menu · Meter · PageTitle · Panel · Popover · Progress · Segmented · Select · Skeleton · Spinner · Stat · Stepper · Switch · Table · Tabs · Textarea · Toast · Tooltip

**Math** (`gauth-ui/math`). RichText · Tex

**Learning.** AnswerOption · Composer · Generating · LevelBar · LevelChip · LevelLadder · LevelMark · Reveal · StepProgress · WorkedSteps

Each has a guideline in [`design/components/`](design/components). `pnpm gallery` shows them all on one page, in both languages.

## Develop

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm tokens     # after a change to src/styles/tokens.css
pnpm gallery    # every component on one page
```
