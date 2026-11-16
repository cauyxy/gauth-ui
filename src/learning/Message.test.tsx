import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Message } from './Message'

it('shows what the person wrote, with their name for a screen reader first', () => {
  const { container } = render(
    <Message from="user" className="mine">
      Which students mixed up the legs and the hypotenuse?
    </Message>,
  )
  const message = container.firstElementChild!
  expect(message).toHaveClass('gx-message', 'gx-message--user', 'mine')
  expect(message).toHaveTextContent(/^You\s*Which students mixed up the legs and the hypotenuse\?$/)
  expect(screen.getByText('You')).toHaveClass('gx-visually-hidden')
})

it("names Gauth AI before a reply and keeps the product's content", () => {
  const { container } = render(
    <Message from="ai">
      <p>Six students added the legs.</p>
      <button type="button">Open the answers</button>
    </Message>,
  )
  const message = container.firstElementChild!
  expect(message).toHaveClass('gx-message--ai')
  expect(message.firstElementChild).toHaveTextContent('Gauth AI')
  expect(message.firstElementChild).toHaveClass('gx-visually-hidden')
  expect(screen.getByText('Six students added the legs.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open the answers' })).toBeInTheDocument()
})

it("names the speaker in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <Message from="user">¿Quién necesita apoyo?</Message>
      <Message from="ai">Seis estudiantes.</Message>
    </LocaleProvider>,
  )
  expect(screen.getByText('Tú')).toHaveClass('gx-visually-hidden')
  expect(screen.getByText('Gauth AI')).toHaveClass('gx-visually-hidden')
})
