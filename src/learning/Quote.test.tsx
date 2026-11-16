import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../core/locale'
import { Quote } from './Quote'

const TEXT = 'Six students added the legs, 6 + 8 = 14, and did not square them first.'

it('is a blockquote with the quoted text and no button', () => {
  render(<Quote className="mine">{TEXT}</Quote>)
  const quote = screen.getByRole('blockquote')
  expect(quote).toHaveClass('gx-quote', 'mine')
  expect(quote).toHaveTextContent(TEXT)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

it('ends with a small Remove button when it can be taken off', async () => {
  const onRemove = vi.fn()
  render(<Quote onRemove={onRemove}>{TEXT}</Quote>)
  const remove = screen.getByRole('button', { name: 'Remove' })
  expect(remove).toHaveClass('gx-icon-btn--ghost', 'gx-icon-btn--sm')
  expect(screen.getByRole('blockquote').lastElementChild).toBe(remove)
  await userEvent.click(remove)
  expect(onRemove).toHaveBeenCalledOnce()
})

it("names the button in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <Quote onRemove={() => {}}>Seis estudiantes sumaron los catetos.</Quote>
    </LocaleProvider>,
  )
  expect(screen.getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
})
