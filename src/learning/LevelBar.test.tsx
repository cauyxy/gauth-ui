import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { LevelBar } from './LevelBar'

const counts = { not_started: 2, attempted: 4, familiar: 6, proficient: 7, mastered: 9 }

it('names what it counts and each level, Mastered first', () => {
  render(<LevelBar label="Geometry · Period 3" counts={counts} className="mine" />)
  const bar = screen.getByRole('img', { name: 'Geometry · Period 3, Mastered: 9, Proficient: 7, Familiar: 6, Attempted: 4, Not started: 2' })
  expect(bar).toHaveClass('gx-level-bar', 'mine')
  const parts = [...bar.children]
  expect(parts.map((p) => p.className.split('--')[1])).toEqual(['mastered', 'proficient', 'familiar', 'attempted', 'not-started'])
  expect(parts[0]).toHaveStyle({ flexGrow: '9' })
  expect(parts[4]).toHaveStyle({ flexGrow: '2' })
})

it('has no part for a level with none', () => {
  render(<LevelBar label="Period 5" counts={{ mastered: 3, familiar: 0, attempted: 1 }} />)
  const bar = screen.getByRole('img', { name: 'Period 5, Mastered: 3, Attempted: 1' })
  expect(bar.children).toHaveLength(2)
})

it('is the empty track when nothing is counted', () => {
  render(<LevelBar label="Period 6" counts={{ mastered: 0 }} />)
  expect(screen.getByRole('img', { name: 'Period 6' })).toBeEmptyDOMElement()
})

it('names the levels in Spanish', () => {
  render(
    <LocaleProvider locale="es">
      <LevelBar label="Geometría · Periodo 3" counts={{ proficient: 7, attempted: 4 }} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('img', { name: 'Geometría · Periodo 3, Competente: 7, Intentado: 4' })).toBeInTheDocument()
})
