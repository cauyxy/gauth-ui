import { useState } from 'react'
import { Avatar } from '../src/components/Avatar'
import { Button } from '../src/components/Button'
import { Chip } from '../src/components/Chip'
import { Dot } from '../src/components/Dot'
import { IconBox } from '../src/components/IconBox'
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
import { Icon } from '../src/core/Icon'

const VIEWS = [
  { value: 'class', label: 'Class' },
  { value: 'student', label: 'Student' },
  { value: 'skill', label: 'Skill' },
] as const

export default function Core() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('class')
  const [on, setOn] = useState(true)
  return (
    <>
      <section className="g-section">
        <h2>Button</h2>
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
      </section>
      <section className="g-section">
        <h2>Segmented, Switch</h2>
        <div className="g-row">
          <Segmented label="View" value={view} options={VIEWS} onChange={setView} />
          <Switch checked={on} onChange={setOn} label="Show hints" />
        </div>
      </section>
      <section className="g-section">
        <h2>Chip, Avatar, Dot, IconBox</h2>
        <div className="g-row">
          <Chip>Period 3</Chip>
          <Chip tone="blue">HSG.SRT.B.5</Chip>
          <Chip tone="violet">+40 XP</Chip>
          <Chip tone="good">Done</Chip>
          <Chip tone="warn">Look here</Chip>
          <Chip tone="pink">New best</Chip>
          <Chip tone="ink">3</Chip>
          <Avatar name="Maya Chen" />
          <Avatar name="Diego Ramirez" />
          <Avatar name="Aisha Khan" size={40} />
          <Dot />
          <IconBox>
            <Icon name="search" />
          </IconBox>
        </div>
      </section>
      <section className="g-section">
        <h2>Panel, Stat</h2>
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
      </section>
      <section className="g-section">
        <h2>Tooltip, Popover</h2>
        <div className="g-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Similar triangles have equal angles.</TooltipContent>
          </Tooltip>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="soft">Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div style={{ padding: 'var(--gx-space-4)' }}>14 students are Proficient in HSG.SRT.B.5.</div>
            </PopoverContent>
          </Popover>
        </div>
      </section>
      <section className="g-section">
        <h2>Meter, Progress, Spinner, Skeleton</h2>
        <div className="g-col">
          <Meter value={62} />
          <Progress value={33} label="Practice set">
            2 of 6
          </Progress>
          <Progress label="Building your set">Building</Progress>
          <div className="g-row">
            <Spinner />
            <Skeleton style={{ height: '1rem', width: '12rem' }} />
          </div>
        </div>
      </section>
    </>
  )
}
