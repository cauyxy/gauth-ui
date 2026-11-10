import { useState } from 'react'
import { Avatar } from '../src/components/Avatar'
import { Button } from '../src/components/Button'
import { Chip } from '../src/components/Chip'
import { ChipToggle } from '../src/components/ChipToggle'
import { CoverCard } from '../src/components/CoverCard'
import { Dot } from '../src/components/Dot'
import { IconBox } from '../src/components/IconBox'
import { IconButton } from '../src/components/IconButton'
import { Meter } from '../src/components/Meter'
import { Panel, PanelHeader } from '../src/components/Panel'
import { Popover, PopoverContent, PopoverTrigger } from '../src/components/Popover'
import { Progress } from '../src/components/Progress'
import { Segmented } from '../src/components/Segmented'
import { Skeleton } from '../src/components/Skeleton'
import { Spinner } from '../src/components/Spinner'
import { Stat } from '../src/components/Stat'
import { Switch } from '../src/components/Switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '../src/components/Tooltip'
import { Icon, type IconName } from '../src/core/Icon'
import { ICONS } from '../src/core/icons'
import { Section } from './section'

const VIEWS = [
  { value: 'class', label: 'Class' },
  { value: 'student', label: 'Student' },
  { value: 'skill', label: 'Skill' },
] as const

const FILTERS = ['Needs support', 'Not started', 'Turned in', 'Late'] as const
const SKILLS: readonly { name: string; icon: IconName }[] = [
  { name: 'Worksheet', icon: 'file' },
  { name: 'Quiz', icon: 'check-circle' },
  { name: 'Lesson plan', icon: 'calendar' },
  { name: 'Grade homework', icon: 'edit' },
]

/** A cover drawn with tokens: a soft ground and a sheet of paper. The gallery loads no picture files. */
function Cover({ tone }: { tone: 'violet' | 'blue' | 'good' }) {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ width: '100%', height: '100%', background: `var(--gx-color-${tone}-soft)` }}>
      <rect x="46" y="20" width="68" height="96" rx="6" style={{ fill: 'var(--gx-color-white)' }} />
      <rect x="56" y="33" width="28" height="5" rx="2.5" style={{ fill: `var(--gx-color-${tone})` }} />
      {[48, 58, 68, 78, 88].map((y, i) => (
        <rect key={y} x="56" y={y} width={i % 2 ? 36 : 48} height="3" rx="1.5" style={{ fill: 'var(--gx-color-rule)' }} />
      ))}
    </svg>
  )
}

export default function Core() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('class')
  const [on, setOn] = useState(true)
  const [aloud, setAloud] = useState(false)
  const [liked, setLiked] = useState(true)
  const [filters, setFilters] = useState<readonly string[]>(['Needs support'])
  const [skill, setSkill] = useState<string | null>('Worksheet')
  const [files, setFiles] = useState<readonly string[]>(['Unit 4 worksheet.pdf', 'Exit ticket.docx'])
  const [codes, setCodes] = useState<readonly string[]>(['HSG.SRT.B.5'])
  return (
    <>
      <Section title="Button">
        <div className="g-row">
          <Button>Assign</Button>
          <Button variant="soft">Review</Button>
          <Button variant="outline">Reteach</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="link">See all</Button>
          <Button disabled>Assign</Button>
        </div>
        <div className="g-row" style={{ marginTop: 'var(--gx-space-4)' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Check answer</Button>
        </div>
      </Section>
      <Section title="IconButton">
        <div className="g-row">
          <IconButton label="Print">
            <Icon name="printer" />
          </IconButton>
          <IconButton label="Download" variant="soft">
            <Icon name="download" />
          </IconButton>
          <IconButton label="More" variant="outline">
            <Icon name="more" />
          </IconButton>
          <IconButton label="Send" variant="ink">
            <Icon name="arrow-up" />
          </IconButton>
          <IconButton label="Good reply" pressed={liked} onClick={() => setLiked(!liked)}>
            <Icon name="thumbs-up" />
          </IconButton>
          <IconButton label="Print" disabled>
            <Icon name="printer" />
          </IconButton>
          <IconButton label="Copy" size="sm">
            <Icon name="copy" />
          </IconButton>
          <IconButton label="Copy" size="lg" variant="outline">
            <Icon name="copy" />
          </IconButton>
          <IconButton label="Copy" size="xl" variant="soft">
            <Icon name="copy" />
          </IconButton>
        </div>
        <div className="g-icons">
          {(Object.keys(ICONS) as IconName[]).map((name) => (
            <span key={name} className="g-icon">
              <Icon name={name} />
              {name}
            </span>
          ))}
        </div>
      </Section>
      <Section title="Segmented">
        <div className="g-row">
          <Segmented label="View" value={view} options={VIEWS} onChange={setView} />
        </div>
      </Section>
      <Section title="Switch">
        <div className="g-row">
          <Switch checked={on} onChange={setOn} label="Show hints" />
          <Switch checked={aloud} onChange={setAloud} label="Read aloud" />
        </div>
      </Section>
      <Section title="ChipToggle">
        <div className="g-col">
          <div role="group" aria-label="Filter students" className="g-row" style={{ gap: 'var(--gx-space-2)' }}>
            {FILTERS.map((name) => (
              <ChipToggle
                key={name}
                pressed={filters.includes(name)}
                onChange={(pressed) => setFilters(pressed ? [...filters, name] : filters.filter((f) => f !== name))}
              >
                {name}
              </ChipToggle>
            ))}
            <ChipToggle pressed={false} onChange={() => {}} disabled>
              Excused
            </ChipToggle>
          </div>
          <div role="group" aria-label="What to make" className="g-row" style={{ gap: 'var(--gx-space-2)' }}>
            {SKILLS.map(({ name, icon }) => (
              <ChipToggle key={name} size="md" pressed={skill === name} onChange={(pressed) => setSkill(pressed ? name : null)}>
                <Icon name={icon} />
                {name}
              </ChipToggle>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Chip">
        <div className="g-row">
          <Chip>Period 3</Chip>
          <Chip tone="blue">HSG.SRT.B.5</Chip>
          <Chip tone="violet">+40 XP</Chip>
          <Chip tone="good">Done</Chip>
          <Chip tone="warn">Look here</Chip>
          <Chip tone="pink">New best</Chip>
          <Chip tone="ink">3</Chip>
          <Chip>
            <Icon name="users" />
            28 students
          </Chip>
          {files.map((name) => (
            <Chip key={name} onRemove={() => setFiles(files.filter((f) => f !== name))} removeLabel={`Remove ${name}`}>
              <Icon name="file" />
              {name}
            </Chip>
          ))}
          {codes.map((code) => (
            <Chip key={code} tone="blue" onRemove={() => setCodes(codes.filter((c) => c !== code))}>
              {code}
            </Chip>
          ))}
        </div>
      </Section>
      <Section title="Avatar">
        <div className="g-row">
          <Avatar name="Maya Chen" />
          <Avatar name="Diego Ramirez" />
          <Avatar name="Aisha Khan" size={40} />
        </div>
      </Section>
      <Section title="Dot">
        <div className="g-row">
          <Dot />
          <Dot color="var(--gx-color-good)" />
          <Dot color="var(--gx-color-blue)" size={8} />
        </div>
      </Section>
      <Section title="IconBox">
        <div className="g-row">
          <IconBox>
            <Icon name="search" />
          </IconBox>
          <IconBox>
            <Icon name="users" />
          </IconBox>
          <IconBox>
            <Icon name="calendar" />
          </IconBox>
        </div>
      </Section>
      <Section title="Panel">
        <div className="g-col">
          <Panel>
            <PanelHeader title="Needs support">
              <Button variant="outline">Reteach</Button>
            </PanelHeader>
            <div className="g-row" style={{ padding: 'var(--gx-space-5)' }}>
              <Stat label="Proficient" value="62%" sub="+8 pts" />
              <Stat label="Turned in" value="24" sub="of 28" />
            </div>
          </Panel>
        </div>
      </Section>
      <Section title="Stat">
        <div className="g-row">
          <Stat label="Proficient" value="62%" sub="+8 pts" />
          <Stat label="Turned in" value="24" sub="of 28" />
          <Stat label="Needs support" value="5" />
        </div>
      </Section>
      <Section title="CoverCard">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))', gap: 'var(--gx-space-4)' }}>
          <CoverCard
            href="#CoverCard"
            cover={<Cover tone="violet" />}
            title="Worksheet"
            description="Practice problems on one skill, with an answer key."
          />
          <CoverCard
            cover={<Cover tone="blue" />}
            title="Exit ticket: similar triangles and scale factors"
            description="5 questions on similar triangles. Made after Thursday's lesson on scale factors, with a worked answer for each one."
            meta={
              <>
                <Chip tone="blue">HSG.SRT.B.5</Chip>
                Mon, Nov 9
              </>
            }
          />
          <CoverCard
            cover={<Cover tone="good" />}
            title="Pythagorean theorem: guided notes"
            description="Notes for one class period."
            meta={<Chip>Grade 8</Chip>}
          />
        </div>
      </Section>
      <Section title="Tooltip">
        <div className="g-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Similar triangles have equal angles.</TooltipContent>
          </Tooltip>
        </div>
      </Section>
      <Section title="Popover">
        <div className="g-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="soft">Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div style={{ padding: 'var(--gx-space-4)' }}>14 students are Proficient in HSG.SRT.B.5.</div>
            </PopoverContent>
          </Popover>
        </div>
      </Section>
      <Section title="Meter">
        <div className="g-col">
          <Meter value={62} />
          <Meter value={18} />
        </div>
      </Section>
      <Section title="Progress">
        <div className="g-col">
          <Progress value={33} label="Practice set">
            2 of 6
          </Progress>
          <Progress label="Building your set">Building</Progress>
        </div>
      </Section>
      <Section title="Spinner">
        <div className="g-row">
          <Spinner />
        </div>
      </Section>
      <Section title="Skeleton">
        <div className="g-col">
          <Skeleton style={{ height: '1rem', width: '12rem' }} />
          <Skeleton style={{ height: '1rem', width: '18rem' }} />
          <Skeleton style={{ height: '1rem', width: '9rem' }} />
        </div>
      </Section>
    </>
  )
}
