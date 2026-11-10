import { useState } from 'react'
import { Segmented } from '../../src'

const VIEWS = [
  { value: 'class', label: 'Class' },
  { value: 'student', label: 'Student' },
  { value: 'skill', label: 'Skill' },
] as const

export function View() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('class')
  return <Segmented label="View" value={view} options={VIEWS} onChange={setView} />
}
