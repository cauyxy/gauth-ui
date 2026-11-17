/**
 * The components in the order the gallery and the docs site show them. Plain data, so a test reads it without loading the
 * examples; rules.test.ts checks that it shows each component once.
 */
export const GROUPS: { slug: string; title: string; names: string[] }[] = [
  {
    slug: 'basics',
    title: 'Basics',
    names: [
      'Button',
      'IconButton',
      'Segmented',
      'Switch',
      'Chip',
      'ChipToggle',
      'Avatar',
      'Dot',
      'IconBox',
      'Panel',
      'Stat',
      'CoverCard',
      'Tooltip',
      'Popover',
      'Meter',
      'Progress',
      'Spinner',
      'Skeleton',
    ],
  },
  {
    slug: 'forms',
    title: 'Forms',
    names: [
      'Field',
      'Input',
      'NumberInput',
      'Textarea',
      'Select',
      'Combobox',
      'DatePicker',
      'DateRangePicker',
      'Checkbox',
      'RadioGroup',
      'Slider',
      'FileDropzone',
    ],
  },
  { slug: 'overlays', title: 'Overlays and feedback', names: ['Dialog', 'Sheet', 'Menu', 'Toast', 'EmptyState', 'Callout'] },
  {
    slug: 'structure',
    title: 'Structure and Gauth AI',
    names: ['Breadcrumbs', 'PageTitle', 'Prose', 'Tabs', 'Table', 'Pagination', 'Accordion', 'Separator', 'Kbd', 'Stepper', 'Composer', 'Generating'],
  },
  { slug: 'conversation', title: 'Conversation', names: ['Message', 'AiStatus', 'ReplyActions', 'FollowUps', 'Quote'] },
  {
    slug: 'learning',
    title: 'Learning',
    names: ['LevelMark', 'LevelChip', 'LevelLadder', 'LevelBar', 'AnswerOption', 'AnswerFeedback', 'Reveal', 'WorkedSteps', 'StepProgress', 'StudentCard'],
  },
  { slug: 'math', title: 'Math', names: ['Tex', 'RichText'] },
]
