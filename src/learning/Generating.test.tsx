import { render, screen, within } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Generating, type GeneratingStep } from './Generating'

const STEPS: readonly GeneratingStep[] = [
  { label: 'Read the class\'s readiness results', state: 'done' },
  { label: 'Writing Form B', state: 'current' },
  { label: 'Check each answer', state: 'upcoming' },
]

it('is one status that lists the steps of the work', () => {
  render(<Generating steps={STEPS} label="Building Form B" className="mine" />)
  const status = screen.getByRole('status', { name: 'Building Form B' })
  expect(status).toHaveClass('gx-generating', 'mine')
  expect(within(status).getAllByRole('listitem').map((item) => item.textContent)).toEqual(STEPS.map((step) => step.label))
})

it('marks the done, current and upcoming steps with a shape each', () => {
  const { container } = render(<Generating steps={STEPS} />)
  const [done, current, upcoming] = screen.getAllByRole('listitem')
  expect(done).toHaveAttribute('data-state', 'done')
  expect(done!.querySelector('svg')).toBeInTheDocument()
  expect(current).toHaveAttribute('aria-current', 'step')
  expect(current!.querySelector('.gx-spinner')).toBeInTheDocument()
  expect(upcoming).toHaveAttribute('data-state', 'upcoming')
  expect(upcoming).not.toHaveAttribute('aria-current')
  expect(upcoming!.querySelector('svg, .gx-spinner')).toBeNull()
  expect(container.querySelectorAll('.gx-spinner')).toHaveLength(1)
})

it('is named Loading in the page\'s language, once', () => {
  const { rerender } = render(<Generating steps={STEPS} />)
  expect(screen.getAllByRole('status')).toHaveLength(1)
  expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  rerender(
    <LocaleProvider locale="es">
      <Generating steps={STEPS} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
})
