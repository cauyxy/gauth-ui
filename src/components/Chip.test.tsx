import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Icon } from '../core/Icon'
import { LocaleProvider } from '../core/locale'
import { Chip } from './Chip'

it('is neutral by default and passes span props through', () => {
  render(<Chip title="Solve linear equations">A-REI.B.3</Chip>)
  const chip = screen.getByText('A-REI.B.3')
  expect(chip).toHaveClass('gx-chip', 'gx-chip--neutral')
  expect(chip).toHaveAttribute('title', 'Solve linear equations')
})

it('takes a tone', () => {
  render(<Chip tone="blue">G-CO.A.1</Chip>)
  expect(screen.getByText('G-CO.A.1')).toHaveClass('gx-chip--blue')
})

it('has no button without onRemove', () => {
  render(<Chip>Period 3</Chip>)
  expect(screen.getByText('Period 3')).not.toHaveClass('gx-chip--removable')
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

it('ends with a remove button when it has onRemove', async () => {
  const onRemove = vi.fn()
  render(<Chip onRemove={onRemove}>worksheet.pdf</Chip>)
  const chip = screen.getByText('worksheet.pdf')
  expect(chip).toHaveClass('gx-chip--removable')
  const remove = screen.getByRole('button', { name: 'Remove' })
  expect(chip.lastElementChild).toBe(remove)
  expect(remove).toHaveAttribute('type', 'button')
  expect(remove.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  await userEvent.tab()
  expect(remove).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onRemove).toHaveBeenCalledOnce()
})

it('names the remove button with removeLabel, or in the language of the page', () => {
  render(
    <LocaleProvider locale="es">
      <Chip onRemove={() => {}}>hoja.pdf</Chip>
      <Chip onRemove={() => {}} removeLabel="Quitar examen.pdf">
        examen.pdf
      </Chip>
    </LocaleProvider>,
  )
  expect(screen.getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Quitar examen.pdf' })).toBeInTheDocument()
})

it('may start with an icon, which is decoration', () => {
  render(
    <Chip>
      <Icon name="file" />
      worksheet.pdf
    </Chip>,
  )
  const chip = screen.getByText('worksheet.pdf')
  expect(chip.firstElementChild?.tagName).toBe('svg')
  expect(chip.firstElementChild).toHaveAttribute('aria-hidden', 'true')
})
