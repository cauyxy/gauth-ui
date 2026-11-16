# gauth-ui

The Gauth design system: tokens, React components and the design rules they follow. White ground, ink text, hairline-edged cards instead of drop shadows, and the red Gauth mark as the only red on the page.

The design rules ship with the package: [`design/README.md`](design/README.md) says what each color, type size and component means.

## Install

```bash
pnpm add gauth-ui
```

React 19 and Tailwind 4 are peer dependencies: the components are written in Tailwind classes, the same way as shadcn/ui, and your Tailwind build makes their CSS. Load Google Sans in the page's `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" />
```

## Use

In your stylesheet, after Tailwind:

```css
@import 'tailwindcss';
@import 'gauth-ui/styles.css';
```

That one line gives Tailwind the Gauth tokens as its theme, the base styles, and the components to read class names from. Then use the components:

```tsx
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

- **The theme is Gauth's only.** The tokens are utilities (`bg-ink`, `text-muted`, `rounded-2xl`, `shadow-edge`, `font-control`). Tailwind's own palette, type sizes and shadows are cleared, so `bg-red-500` and `shadow-lg` give nothing.
- **Your class wins.** `<Button className="w-full bg-surface">` replaces the classes it conflicts with.
- **Every token is also a CSS variable** (`var(--gx-color-ink)`, `var(--gx-h-md)`) for the styles you write by hand.
- **Page defaults come with it**, in the base layer: the font, text color and line height on `html`, and a white ground on `body`.

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

**Core.** Avatar · Breadcrumbs · Button · Callout · Checkbox · Chip · ChipToggle · CoverCard · DatePicker · Dialog · Dot · EmptyState · Field · Icon · IconBox · IconButton · Input · Menu · Meter · PageTitle · Panel · Popover · Progress · Segmented · Select · Skeleton · Spinner · Stat · Stepper · Switch · Table · Tabs · Textarea · Toast · Tooltip

**Math** (`gauth-ui/math`). RichText · Tex

**Learning.** AiStatus · AnswerOption · Composer · FollowUps · Generating · LevelBar · LevelChip · LevelLadder · LevelMark · Message · Quote · ReplyActions · Reveal · StepProgress · WorkedSteps

Each has a guideline in [`design/components/`](design/components) and examples with their code at [ui.gauthx.app](https://ui.gauthx.app). `pnpm gallery` shows them all on one page, in both languages.

## License

All rights reserved. See `LICENSE`. The package is on npm so that Gauth products can install it; that gives no right to use it elsewhere.

## Credits

The icons are from [Lucide](https://lucide.dev) (ISC). See `THIRD-PARTY-NOTICES.md`.

## Develop

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm tokens     # after a change to src/styles/tokens.css
pnpm gallery    # every component on one page
pnpm site       # the docs site, locally
```
