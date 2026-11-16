/*
 * The comparison page: each gauthx component (@gauthx/ui, Tailwind classes) beside the gauth-ui one that replaces it.
 * compare/run.ts serves this page and compares the computed styles of every pair.
 *
 * ?old   the page gauthx builds: Tailwind with gauthx's theme. Read the old components here.
 * ?new   the page a product on gauth-ui builds: Tailwind with gauth-ui's styles. Read the new components here.
 *
 * The two themes give the same names different values, so each side is read on its own page.
 */
import * as Old from '@gauthx/ui'
import { Switch as OldSwitch } from '@gauthx-teach/authoring-ui'
import { IconBox as OldIconBox, Meter as OldMeter } from '@gauthx-teach/core-ui'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import * as New from '../dist/index.js'

await (location.search === '?old' ? import('./.tmp/old.css') : import('./.tmp/new.css'))

const cases: [string, ReactNode, ReactNode][] = []
const add = (name: string, old: ReactNode, next: ReactNode) => cases.push([name, old, next])

for (const variant of ['ink', 'soft', 'outline', 'ghost', 'link'] as const)
  for (const size of ['sm', 'md', 'lg', 'xl'] as const)
    add(
      `button-${variant}-${size}`,
      <Old.Button variant={variant} size={size}>
        Send practice
      </Old.Button>,
      <New.Button variant={variant} size={size}>
        Send practice
      </New.Button>,
    )
add('button-disabled', <Old.Button disabled>Publish</Old.Button>, <New.Button disabled>Publish</New.Button>)
/* Names that start with tw- pass Tailwind utilities to the component: the caller's class must win on both sides. */
add(
  'tw-button-utility-override',
  <Old.Button variant="outline" className="h-12 w-full rounded-2xl text-base">
    Continue with Google
  </Old.Button>,
  <New.Button variant="outline" className="h-12 w-full rounded-2xl text-base">
    Continue with Google
  </New.Button>,
)
add(
  'button-as-link',
  <a href="#x" className={Old.buttonVariants({ variant: 'outline', size: 'md' })}>
    Review
  </a>,
  <a href="#x" className={New.buttonClass({ variant: 'outline', size: 'md' })}>
    Review
  </a>,
)
for (const tone of ['neutral', 'blue', 'violet', 'good', 'warn', 'pink', 'ink'] as const)
  add(`chip-${tone}`, <Old.Chip tone={tone}>A-REI.B.3</Old.Chip>, <New.Chip tone={tone}>A-REI.B.3</New.Chip>)
add(
  'panel',
  <Old.Panel>
    <Old.PanelHeader title="Needs support">
      <Old.Button variant="outline">Reteach</Old.Button>
    </Old.PanelHeader>
  </Old.Panel>,
  <New.Panel>
    <New.PanelHeader title="Needs support">
      <New.Button variant="outline">Reteach</New.Button>
    </New.PanelHeader>
  </New.Panel>,
)
const forms = [
  { value: 'a', label: 'Form A' },
  { value: 'b', label: 'Form B' },
  { value: 'c', label: 'Form C' },
] as const
add(
  'segmented-fit',
  <Old.Segmented label="Form" value="b" options={forms} onChange={() => {}} />,
  <New.Segmented label="Form" value="b" options={forms} onChange={() => {}} />,
)
add(
  'segmented-fill',
  <Old.Segmented label="Form" value="a" options={forms} onChange={() => {}} fill />,
  <New.Segmented label="Form" value="a" options={forms} onChange={() => {}} fill />,
)
add(
  'segmented-links',
  <span className={Old.segmentedTrack}>
    <a href="#a" className={Old.segmentedOption(true)}>
      Form A
    </a>
    <a href="#b" className={Old.segmentedOption(false)}>
      Form B
    </a>
  </span>,
  <span className={New.segmentedTrackClass()}>
    <a href="#a" className={New.segmentedOptionClass(true)}>
      Form A
    </a>
    <a href="#b" className={New.segmentedOptionClass(false)}>
      Form B
    </a>
  </span>,
)
add('switch-on', <OldSwitch on onChange={() => {}} label="Hints" />, <New.Switch checked onChange={() => {}} label="Hints" />)
add('switch-off', <OldSwitch on={false} onChange={() => {}} label="Hints" />, <New.Switch checked={false} onChange={() => {}} label="Hints" />)
add('tw-skeleton-utility', <Old.Skeleton className="h-8 w-40" />, <New.Skeleton className="h-8 w-40" />)
add('page-skeleton', <Old.PageSkeleton panels={1} rows={2} />, <New.PageSkeleton panels={1} rows={2} />)
for (const name of ['Rachel Carter', 'Ms. Lopez', 'Devon Wright', 'Aiko Tanaka', 'Sam Lee', 'Priya Natarajan Rao'])
  add(`avatar-${name}`, <Old.Avatar name={name} size={36} />, <New.Avatar name={name} size={36} />)
add('avatar-plain', <Old.Avatar name="Rachel Carter" plain />, <New.Avatar name="Rachel Carter" plain />)
add('stat', <Old.Stat label="Active students" value="412" sub="of 480" />, <New.Stat label="Active students" value="412" sub="of 480" />)
add('tw-meter-utility', <OldMeter value={40} className="w-40" />, <New.Meter value={40} className="w-40" />)
add('icon-box', <OldIconBox>P</OldIconBox>, <New.IconBox>P</New.IconBox>)
add('dot', <Old.Dot />, <New.Dot />)
add(
  'tooltip',
  <Old.Tooltip open>
    <Old.TooltipTrigger>62%</Old.TooltipTrigger>
    <Old.TooltipContent data-portal="old-tooltip">Share of the class at Proficient</Old.TooltipContent>
  </Old.Tooltip>,
  <New.Tooltip open>
    <New.TooltipTrigger>62%</New.TooltipTrigger>
    <New.TooltipContent data-portal="new-tooltip">Share of the class at Proficient</New.TooltipContent>
  </New.Tooltip>,
)
add(
  'popover',
  <Old.Popover open>
    <Old.PopoverTrigger>Why this one</Old.PopoverTrigger>
    <Old.PopoverContent data-portal="old-popover">Six students missed this step.</Old.PopoverContent>
  </Old.Popover>,
  <New.Popover open>
    <New.PopoverTrigger>Why this one</New.PopoverTrigger>
    <New.PopoverContent data-portal="new-popover">Six students missed this step.</New.PopoverContent>
  </New.Popover>,
)

createRoot(document.getElementById('root')!).render(
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
    {cases.map(([name, old, next]) => (
      <div key={name} style={{ display: 'grid', gridTemplateColumns: '220px 420px 420px', alignItems: 'start', gap: 16 }}>
        <code style={{ fontSize: 12 }}>{name}</code>
        <div data-old={name}>{old}</div>
        <div data-new={name}>{next}</div>
      </div>
    ))}
  </div>,
)
