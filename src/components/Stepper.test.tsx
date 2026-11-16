import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Stepper } from './Stepper'

const STEPS = ['Standard', 'Problems', 'Review', 'Assign'] as const

it('lists the steps in order with their names', () => {
  render(<Stepper steps={STEPS} current={1} className="mine" />)
  expect(screen.getByRole('list')).toHaveClass('gx-stepper', 'mine')
  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Standard', '2Problems', '3Review', '4Assign'])
})

it('marks each step done, current or upcoming, in words and in shape', () => {
  render(<Stepper steps={STEPS} current={1} />)
  const [done, current, upcoming, last] = screen.getAllByRole('listitem')
  expect(done).toHaveAttribute('data-state', 'done')
  expect(done).not.toHaveAttribute('aria-current')
  expect(screen.getByRole('img', { name: 'Step 1, done' }).querySelector('svg')).toBeInTheDocument()
  expect(current).toHaveAttribute('aria-current', 'step')
  expect(screen.getByRole('img', { name: 'Step 2, current' })).toHaveTextContent('2')
  expect(upcoming).toHaveAttribute('data-state', 'upcoming')
  expect(last).not.toHaveAttribute('aria-current')
  expect(screen.getByRole('img', { name: 'Step 4' })).toHaveTextContent('4')
})

it('moves with current', () => {
  const { rerender } = render(<Stepper steps={STEPS} current={0} />)
  expect(screen.getByRole('img', { name: 'Step 1, current' })).toBeInTheDocument()
  rerender(<Stepper steps={STEPS} current={3} />)
  expect(screen.getByRole('img', { name: 'Step 3, done' })).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')[3]).toHaveAttribute('aria-current', 'step')
})

it("names the steps in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <Stepper steps={['Estándar', 'Problemas']} current={1} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('img', { name: 'Paso 1, completado' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Paso 2, actual' })).toBeInTheDocument()
})
