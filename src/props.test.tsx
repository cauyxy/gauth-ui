/*
 * AGENTS.md, Props: a component passes native props and `ref` on to its element. Each component is drawn here with an
 * `id`, a `data-*` attribute and a `ref`, and all three must land on one element. A new component needs a line here.
 */
import { render } from '@testing-library/react'
import { createRef, type ReactElement, type RefObject } from 'react'
import * as ui from './index'
import { RichText, Tex } from './math'

type Probe = { id: string; 'data-probe': string; ref: RefObject<never> }

/* Parts that draw no element of their own: a provider, a root that only keeps state, the toaster. */
const NO_ELEMENT = ['LocaleProvider', 'Toaster', 'Dialog', 'Sheet', 'Popover', 'Menu', 'Tooltip']

const OPTIONS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
]

const CASES: Record<string, (p: Probe) => ReactElement> = {
  Icon: (p) => <ui.Icon name="check" {...p} />,
  Accordion: (p) => (
    <ui.Accordion type="single" {...p}>
      <ui.AccordionItem value="a" title="Title">
        Body
      </ui.AccordionItem>
    </ui.Accordion>
  ),
  AccordionItem: (p) => (
    <ui.Accordion type="single">
      <ui.AccordionItem value="a" title="Title" {...p}>
        Body
      </ui.AccordionItem>
    </ui.Accordion>
  ),
  Avatar: (p) => <ui.Avatar name="Rachel Carter" {...p} />,
  Breadcrumbs: (p) => <ui.Breadcrumbs {...p}>Home</ui.Breadcrumbs>,
  Button: (p) => <ui.Button {...p}>Save</ui.Button>,
  Callout: (p) => <ui.Callout {...p}>Note</ui.Callout>,
  Checkbox: (p) => <ui.Checkbox {...p}>Agree</ui.Checkbox>,
  Chip: (p) => <ui.Chip {...p}>New</ui.Chip>,
  ChipToggle: (p) => <ui.ChipToggle {...p}>Filter</ui.ChipToggle>,
  Combobox: (p) => <ui.Combobox label="Student" options={OPTIONS} {...p} />,
  CoverCard: (p) => <ui.CoverCard cover={null} title="Card" {...p} />,
  Calendar: (p) => <ui.Calendar {...p} />,
  DatePicker: (p) => <ui.DatePicker label="Due" {...p} />,
  DateRangePicker: (p) => <ui.DateRangePicker label="Days" {...p} />,
  DialogActions: (p) => <ui.DialogActions {...p} />,
  DialogClose: (p) => (
    <ui.Dialog open>
      <ui.DialogContent title="Title">
        <ui.DialogClose {...p}>Done</ui.DialogClose>
      </ui.DialogContent>
    </ui.Dialog>
  ),
  DialogContent: (p) => (
    <ui.Dialog open>
      <ui.DialogContent title="Title" {...p} />
    </ui.Dialog>
  ),
  DialogTrigger: (p) => (
    <ui.Dialog>
      <ui.DialogTrigger {...p}>Open</ui.DialogTrigger>
    </ui.Dialog>
  ),
  Dot: (p) => <ui.Dot {...p} />,
  EmptyState: (p) => <ui.EmptyState title="Nothing yet" {...p} />,
  Field: (p) => (
    <ui.Field label="Name" {...p}>
      <ui.Input />
    </ui.Field>
  ),
  FileDropzone: (p) => <ui.FileDropzone onChange={() => {}} {...p} />,
  IconBox: (p) => <ui.IconBox {...p}>x</ui.IconBox>,
  IconButton: (p) => (
    <ui.IconButton label="Close" {...p}>
      <ui.Icon name="close" />
    </ui.IconButton>
  ),
  Input: (p) => <ui.Input label="Name" {...p} />,
  Kbd: (p) => <ui.Kbd {...p}>Enter</ui.Kbd>,
  MenuContent: (p) => (
    <ui.Menu open>
      <ui.MenuTrigger>Open</ui.MenuTrigger>
      <ui.MenuContent {...p} />
    </ui.Menu>
  ),
  MenuItem: (p) => (
    <ui.Menu open>
      <ui.MenuTrigger>Open</ui.MenuTrigger>
      <ui.MenuContent>
        <ui.MenuItem {...p}>One</ui.MenuItem>
      </ui.MenuContent>
    </ui.Menu>
  ),
  MenuSeparator: (p) => (
    <ui.Menu open>
      <ui.MenuTrigger>Open</ui.MenuTrigger>
      <ui.MenuContent>
        <ui.MenuSeparator {...p} />
      </ui.MenuContent>
    </ui.Menu>
  ),
  MenuTrigger: (p) => (
    <ui.Menu>
      <ui.MenuTrigger {...p}>Open</ui.MenuTrigger>
    </ui.Menu>
  ),
  Meter: (p) => <ui.Meter value={40} {...p} />,
  NumberInput: (p) => <ui.NumberInput label="Count" {...p} />,
  PageTitle: (p) => <ui.PageTitle title="Classes" {...p} />,
  Panel: (p) => <ui.Panel {...p} />,
  PanelHeader: (p) => <ui.PanelHeader title="Title" {...p} />,
  Pagination: (p) => <ui.Pagination page={1} count={3} onChange={() => {}} {...p} />,
  PopoverAnchor: (p) => (
    <ui.Popover>
      <ui.PopoverAnchor {...p} />
    </ui.Popover>
  ),
  PopoverContent: (p) => (
    <ui.Popover open>
      <ui.PopoverTrigger>Open</ui.PopoverTrigger>
      <ui.PopoverContent {...p} />
    </ui.Popover>
  ),
  PopoverTrigger: (p) => (
    <ui.Popover>
      <ui.PopoverTrigger {...p}>Open</ui.PopoverTrigger>
    </ui.Popover>
  ),
  Progress: (p) => <ui.Progress value={40} {...p} />,
  Prose: (p) => <ui.Prose {...p} />,
  RadioGroup: (p) => <ui.RadioGroup label="Level" options={OPTIONS} {...p} />,
  Segmented: (p) => <ui.Segmented label="View" options={OPTIONS} {...p} />,
  Select: (p) => <ui.Select label="Grade" options={OPTIONS} {...p} />,
  Separator: (p) => <ui.Separator {...p} />,
  SheetClose: (p) => (
    <ui.Sheet open>
      <ui.SheetContent title="Title">
        <ui.SheetClose {...p}>Done</ui.SheetClose>
      </ui.SheetContent>
    </ui.Sheet>
  ),
  SheetContent: (p) => (
    <ui.Sheet open>
      <ui.SheetContent title="Title" {...p} />
    </ui.Sheet>
  ),
  SheetTrigger: (p) => (
    <ui.Sheet>
      <ui.SheetTrigger {...p}>Open</ui.SheetTrigger>
    </ui.Sheet>
  ),
  PageSkeleton: (p) => <ui.PageSkeleton {...p} />,
  Skeleton: (p) => <ui.Skeleton {...p} />,
  Slider: (p) => <ui.Slider label="Goal" {...p} />,
  Spinner: (p) => <ui.Spinner {...p} />,
  Stat: (p) => <ui.Stat value="12" label="Done" {...p} />,
  Stepper: (p) => <ui.Stepper steps={['One', 'Two']} current={0} {...p} />,
  Switch: (p) => <ui.Switch label="Hints" {...p} />,
  Table: (p) => <ui.Table columns="1fr" label="Rows" {...p} />,
  TableCell: (p) => <ui.TableCell {...p}>1</ui.TableCell>,
  TableHead: (p) => <ui.TableHead {...p} />,
  TableRow: (p) => <ui.TableRow {...p} />,
  Tab: (p) => (
    <ui.Tabs defaultValue="a">
      <ui.TabList>
        <ui.Tab value="a" {...p}>
          A
        </ui.Tab>
      </ui.TabList>
    </ui.Tabs>
  ),
  TabList: (p) => (
    <ui.Tabs defaultValue="a">
      <ui.TabList {...p} />
    </ui.Tabs>
  ),
  TabPanel: (p) => (
    <ui.Tabs defaultValue="a">
      <ui.TabPanel value="a" {...p} />
    </ui.Tabs>
  ),
  Tabs: (p) => <ui.Tabs defaultValue="a" {...p} />,
  Textarea: (p) => <ui.Textarea label="Notes" {...p} />,
  TooltipContent: (p) => (
    <ui.Tooltip open>
      <ui.TooltipTrigger>Open</ui.TooltipTrigger>
      <ui.TooltipContent {...p}>Note</ui.TooltipContent>
    </ui.Tooltip>
  ),
  TooltipTrigger: (p) => (
    <ui.Tooltip>
      <ui.TooltipTrigger {...p}>Open</ui.TooltipTrigger>
    </ui.Tooltip>
  ),
  AiStatus: (p) => (
    <ui.AiStatus state="working" {...p}>
      Reading
    </ui.AiStatus>
  ),
  AnswerFeedback: (p) => <ui.AnswerFeedback state="right" {...p} />,
  AnswerGroup: (p) => (
    <ui.AnswerGroup label="Answers" {...p}>
      <ui.AnswerOption value="a">One</ui.AnswerOption>
    </ui.AnswerGroup>
  ),
  AnswerOption: (p) => (
    <ui.AnswerGroup label="Answers">
      <ui.AnswerOption value="a" {...p}>
        One
      </ui.AnswerOption>
    </ui.AnswerGroup>
  ),
  Composer: (p) => <ui.Composer label="Ask" onSend={() => {}} {...p} />,
  FollowUps: (p) => <ui.FollowUps items={['Why?']} onPick={() => {}} {...p} />,
  Generating: (p) => <ui.Generating steps={[{ label: 'Reading', state: 'current' }]} {...p} />,
  LevelBar: (p) => <ui.LevelBar counts={{ mastered: 2 }} label="Class" {...p} />,
  LevelChip: (p) => <ui.LevelChip level="familiar" {...p} />,
  LevelLadder: (p) => <ui.LevelLadder level="familiar" {...p} />,
  LevelMark: (p) => <ui.LevelMark level="familiar" {...p} />,
  Message: (p) => (
    <ui.Message from="ai" {...p}>
      Hello
    </ui.Message>
  ),
  Quote: (p) => <ui.Quote {...p}>Text</ui.Quote>,
  ReplyActions: (p) => <ui.ReplyActions onCopy={() => {}} {...p} />,
  Reveal: (p) => (
    <ui.Reveal kind="hint" {...p}>
      Try 2
    </ui.Reveal>
  ),
  StepProgress: (p) => <ui.StepProgress done={1} total={3} label="Set" {...p} />,
  StudentCard: (p) => <ui.StudentCard {...p} />,
  StudentCardTitle: (p) => <ui.StudentCardTitle {...p}>Title</ui.StudentCardTitle>,
  WorkedSteps: (p) => <ui.WorkedSteps steps={[{ text: 'x = 2' }]} {...p} />,
  Tex: (p) => <Tex tex="x^2" {...p} />,
  RichText: (p) => <RichText text="Solve $x$" {...p} />,
}

it('has a case for every component of the package', () => {
  const components = Object.keys(ui).filter((name) => /^[A-Z][a-z]/.test(name) && !NO_ELEMENT.includes(name))
  expect(components.filter((name) => !(name in CASES))).toEqual([])
})

it.each(Object.keys(CASES))('%s passes native props and its ref to one element', (name) => {
  const ref = createRef() as RefObject<never>
  render(CASES[name]!({ id: 'probe-id', 'data-probe': 'yes', ref }))
  const element = document.querySelector('[data-probe]')
  expect(element, 'the data-* attribute is on an element').not.toBeNull()
  expect(element?.id, 'the id is on that element').toBe('probe-id')
  expect(ref.current, 'the ref is that element').toBe(element)
})
