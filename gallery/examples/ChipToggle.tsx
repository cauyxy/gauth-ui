import { useState } from 'react'
import { ChipToggle, Icon, type IconName } from '../../src'

const FILTERS = ['Needs support', 'Not started', 'Turned in', 'Late'] as const
const KINDS: readonly { name: string; icon: IconName }[] = [
  { name: 'Worksheet', icon: 'file' },
  { name: 'Quiz', icon: 'check-circle' },
  { name: 'Lesson plan', icon: 'calendar' },
  { name: 'Grade homework', icon: 'edit' },
]

export function Filters() {
  const [filters, setFilters] = useState<readonly string[]>(['Needs support'])
  return (
    <div role="group" aria-label="Filter students" className="flex flex-wrap items-center gap-2">
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
  )
}

export function OneOfMany() {
  const [kind, setKind] = useState<string | null>('Worksheet')
  return (
    <div role="group" aria-label="What to make" className="flex flex-wrap items-center gap-2">
      {KINDS.map(({ name, icon }) => (
        <ChipToggle key={name} size="md" pressed={kind === name} onChange={(pressed) => setKind(pressed ? name : null)}>
          <Icon name={icon} />
          {name}
        </ChipToggle>
      ))}
    </div>
  )
}
