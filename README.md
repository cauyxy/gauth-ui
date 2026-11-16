# gauth-ui

[![npm](https://img.shields.io/npm/v/gauth-ui)](https://www.npmjs.com/package/gauth-ui) [![CI](https://github.com/cauyxy/gauth-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/cauyxy/gauth-ui/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/gauth-ui)](LICENSE)

An unofficial design system in the look of [gauth.com](https://gauth.com): design tokens, React components and the design rules they follow. White ground, ink text, hairline-edged cards instead of drop shadows, and the red Gauth mark as the only red on the page.

[Documentation and live examples](https://ui.gauthx.app) · [Design rules](design/README.md) · [Changelog](CHANGELOG.md)

> gauth-ui is an independent project. It is not affiliated with Gauth, and Gauth does not endorse it. The look is recreated from the public website: its colors, type and surfaces were read from the site, rebuilt as tokens and components, and refined.

## Features

- **Components in three groups.** Core (buttons, fields, panels, overlays, feedback), learning (skill levels, questions and feedback, the Gauth AI composer) and math (formulas, on KaTeX).
- **Written for React 19.** Every component takes the native props of its element and a `ref`, with no `forwardRef`. Controls work controlled or uncontrolled, and go with a native form and a form action.
- **Ready for server components.** Each file that needs the browser is marked `'use client'`, and the rest can be drawn on the server. No wrapper files in a Next.js App Router project.
- **Styled with Tailwind 4 classes**, the same way as shadcn/ui. Your `className` wins over the component's own classes.
- **Accessible.** Native elements, one keyboard-focus ring, text at 4.5:1 or more, and Radix under every floating part.
- **Typed.** Every component exports its props (`ButtonProps`), and every option list is generic over its values.
- **Small in your bundle.** One file for each component, so a bundler keeps only what a page imports.
- **Two languages.** English and Spanish ship with the package; a product can replace any string.

## Requirements

| Needs        | Version | Why                                                                |
| ------------ | ------- | ------------------------------------------------------------------ |
| React        | 19      | `ref` is a prop, so a component passes it on without `forwardRef`  |
| Tailwind CSS | 4       | The components are Tailwind classes, and your build makes their CSS |
| A bundler    | ESM     | The package is ES modules only                                     |

## Install

```bash
pnpm add gauth-ui
```

Load the fonts in the page's `<head>`: Google Sans for everything, and Literata when a page sets a reading passage with `<Prose font="reading">`.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap" />
```

## Quick start

In your stylesheet, after Tailwind:

```css
@import 'tailwindcss';
@import 'gauth-ui/styles.css';
```

That one line gives Tailwind the tokens as its theme, the base styles, and the components to read class names from. Then use the components:

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

## Styling

- **The theme is the package's only.** The tokens are utilities (`bg-ink`, `text-muted`, `rounded-2xl`, `shadow-edge`, `font-control`). Tailwind's own palette, type sizes and shadows are cleared, so `bg-red-500` and `shadow-lg` give nothing.
- **Your class wins.** `<Button className="w-full bg-surface">` replaces the classes it conflicts with. `cn()` joins classes the same way in a component of your own.
- **Every token is also a CSS variable** (`var(--gx-color-ink)`, `var(--gx-h-md)`) for the styles you write by hand.
- **Page defaults come with it**, in the base layer: the font, text color and line height on `html`, and a white ground on `body`.
- **A link that looks like a component** takes the class helper: `<a className={buttonClass({ variant: 'outline' })}>`, or `<Button asChild>` around the link.

## Props and refs

A component passes every native prop on to its element: `id`, `style`, `data-*`, `aria-*`, the events and `ref`. For a control with a wrapper (`Input`, `Select`, `Checkbox`, `Combobox`, `NumberInput`, `Composer`), `className` goes to the wrapper and everything else, with the `ref`, to the control itself.

```tsx
const box = useRef<HTMLTextAreaElement>(null)

<Composer ref={box} label="Ask Gauth AI" maxLength={2000} onSend={send} />
<Panel id="roster" data-testid="roster" aria-busy={loading} />
```

An event handler of yours runs before the component's own, and `event.preventDefault()` stops the component's part.

## Values and forms

A control works both ways. Give it `value` and `onChange`, and your state is the value. Leave `value` out, and the control keeps its own, starting at `defaultValue`. `onChange` gets the new value, not the event.

```tsx
/* The page keeps the value. */
const [grade, setGrade] = useState('7')
<Select label="Grade" options={grades} value={grade} onChange={setGrade} />

/* The control keeps it, and the form sends it. */
<form action={save}>
  <Field label="Name">
    <Input name="name" required />
  </Field>
  <Select label="Grade" name="grade" options={grades} defaultValue="7" />
  <Switch label="Send reminders" name="reminders" defaultChecked />
  <DatePicker label="Due" name="due" />
  <Button type="submit">Save</Button>
</form>
```

A value that can be empty is `null`, never `undefined`: `value={null}` is "nothing picked, and the page keeps it", while leaving `value` out hands the value to the control.

## Server components

The package works in a server component as it is. A file that needs the browser starts with `'use client'`: a server component draws it and passes it plain props. The other files keep no state and set no handler, so they are drawn on the server and send no JavaScript: `Button`, `IconButton`, `Panel`, `PageTitle`, `Prose`, `Table`, `Stat`, `Callout`, `Avatar`, `StudentCard` and more. The helpers `buttonClass`, `segmentedOptionClass`, `pagesOf`, `initialsOf` and `cx` can be called there too.

```tsx
/* app/page.tsx: no 'use client' */
import Link from 'next/link'
import { Button, buttonClass, Dialog, DialogContent, DialogTrigger, PageTitle } from 'gauth-ui'

export default function Page() {
  return (
    <PageTitle title="Classes">
      <Link href="/classes/new" className={buttonClass()}>
        New class
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Import</Button>
        </DialogTrigger>
        <DialogContent title="Import a roster">…</DialogContent>
      </Dialog>
    </PageTitle>
  )
}
```

A function cannot cross from the server to the client, so a control that takes `onChange` from the page lives in a client component of yours, or goes uncontrolled inside a `<form action>`. `toast()` is called in the browser; mount `<Toaster />` once, in the root layout.

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

`en` and `es` ship with the package. `messages` replaces single strings for a product that needs its own word. [`GLOSSARY.md`](GLOSSARY.md) lists the shared words and what each means.

## TypeScript

Every component exports its props, and the shared names are types too:

```tsx
import type { ButtonProps, ComboboxOption, IconName, Level, SelectProps } from 'gauth-ui'

const students: ComboboxOption<StudentId>[] = roster.map((s) => ({ value: s.id, label: s.name }))
```

A control you write yourself joins a `Field` with `useField()`: it gives the `id`, `aria-describedby` and `aria-invalid` that the package's own controls take.

## Components

**Core.** Accordion · Avatar · Breadcrumbs · Button · Callout · Checkbox · Chip · ChipToggle · Combobox · CoverCard · DatePicker · DateRangePicker · Dialog · Dot · EmptyState · Field · FileDropzone · Icon · IconBox · IconButton · Input · Kbd · Menu · Meter · NumberInput · PageTitle · Pagination · Panel · Popover · Progress · Prose · RadioGroup · Segmented · Select · Separator · Sheet · Skeleton · Slider · Spinner · Stat · Stepper · Switch · Table · Tabs · Textarea · Toast · Tooltip

**Math** (`gauth-ui/math`). RichText · Tex

**Learning.** AiStatus · AnswerFeedback · AnswerOption · Composer · FollowUps · Generating · LevelBar · LevelChip · LevelLadder · LevelMark · Message · Quote · ReplyActions · Reveal · StepProgress · StudentCard · WorkedSteps

Each has a guideline in [`design/components/`](design/components) and examples with their code at [ui.gauthx.app](https://ui.gauthx.app); `Icon`'s rules are in [`design/README.md`](design/README.md), and its names are on IconButton's page. `pnpm gallery` shows them all on one page, in both languages.

## What is in the package

| Import                  | What it is                                                              |
| ----------------------- | ----------------------------------------------------------------------- |
| `gauth-ui`              | The core and learning components, the icons, the language               |
| `gauth-ui/math`         | `Tex` and `RichText`, on KaTeX                                          |
| `gauth-ui/styles.css`   | What a product imports after Tailwind: tokens, theme, base styles       |
| `gauth-ui/math.css`     | KaTeX's styles, and how a formula sits in the text                      |
| `gauth-ui/tokens.css`   | The tokens alone, as CSS variables                                      |
| `gauth-ui/theme.css`    | The tokens as a Tailwind 4 theme                                        |

The design rules (`design/`) and the glossary ship in the package too, so a tool or an agent that reads `node_modules` finds them.

## Contributing

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm gallery    # every component on one page
pnpm site       # the docs site, locally
```

[`AGENTS.md`](AGENTS.md) is the guide for a change: how a component is written, the rules the tests check, and how a release goes out. A change to how a component looks is a design decision and needs the owner's OK first.

## License

[MIT](LICENSE): the code, the tokens and the design rules in `design/`. Third-party material stays under its own license (`THIRD-PARTY-NOTICES.md`).

Gauth and the Gauth mark belong to their owner. The license covers this project's own code and documents: it gives no right to the name or the mark, and nobody may use the components to present a product as Gauth's.

## Credits

The icons are from [Lucide](https://lucide.dev) (ISC); their notice is in `THIRD-PARTY-NOTICES.md`. The floating parts are built on [Radix](https://www.radix-ui.com) and formulas are drawn by [KaTeX](https://katex.org): both are dependencies, under MIT.
