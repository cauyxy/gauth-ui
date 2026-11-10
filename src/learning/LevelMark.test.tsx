import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { LEVELS } from '../core/messages'
import { LevelMark } from './LevelMark'

it('is decoration by default, 14px, with the shape class of its level', () => {
  const { container } = render(<LevelMark level="not_started" />)
  const mark = container.firstElementChild
  expect(mark).toHaveClass('gx-level-mark', 'gx-level-mark--not-started')
  expect(mark).toHaveAttribute('aria-hidden', 'true')
  expect(mark).toHaveStyle({ width: '14px', height: '14px' })
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

it('gives each level its own class and takes a size', () => {
  for (const level of LEVELS) {
    const { container } = render(<LevelMark level={level} size={10} className="mine" />)
    expect(container.firstElementChild).toHaveClass(`gx-level-mark--${level.replace('_', '-')}`, 'mine')
    expect(container.firstElementChild).toHaveStyle({ width: '10px' })
  }
})

it('says the name of its level with label, in the language of the page', () => {
  render(<LevelMark level="proficient" label />)
  expect(screen.getByRole('img', { name: 'Proficient' })).toHaveClass('gx-level-mark--proficient')
  render(
    <LocaleProvider locale="es">
      <LevelMark level="proficient" label />
    </LocaleProvider>,
  )
  expect(screen.getByRole('img', { name: 'Competente' })).toBeInTheDocument()
})
