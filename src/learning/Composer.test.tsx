import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { LocaleProvider } from '../core/locale'
import { Composer } from './Composer'

/** A page that keeps the text and empties it when it is sent. */
function Page({ onSend, start = '', disabled }: { onSend: (value: string) => void; start?: string; disabled?: boolean }) {
  const [value, setValue] = useState(start)
  return (
    <Composer
      label="Ask Gauth AI"
      placeholder="Ask about this step"
      value={value}
      onChange={setValue}
      onSend={(text) => {
        onSend(text)
        setValue('')
      }}
      disabled={disabled}
    />
  )
}

const box = () => screen.getByRole('textbox', { name: 'Ask Gauth AI' })
const sendButton = () => screen.getByRole('button', { name: 'Send' })

it('is a one-line text box with a send button and the AI note', () => {
  const { container } = render(<Page onSend={() => {}} />)
  expect(box()).toHaveAttribute('rows', '1')
  expect(box()).toHaveAttribute('placeholder', 'Ask about this step')
  expect(container.firstChild).toHaveClass('gx-composer')
  expect(screen.getByText('Review AI output for accuracy. Follow school policies.')).toHaveClass('gx-composer__note')
})

it('reports each change as the new value', async () => {
  const onChange = vi.fn()
  render(<Composer label="Ask Gauth AI" value="" onChange={onChange} onSend={() => {}} />)
  await userEvent.type(box(), 'W')
  expect(onChange).toHaveBeenLastCalledWith('W')
})

it('sends on Enter and on the button', async () => {
  const onSend = vi.fn()
  render(<Page onSend={onSend} />)
  await userEvent.type(box(), 'Why subtract 3?{Enter}')
  expect(onSend).toHaveBeenLastCalledWith('Why subtract 3?')
  expect(box()).toHaveValue('')
  await userEvent.type(box(), 'Show the next step')
  await userEvent.click(sendButton())
  expect(onSend).toHaveBeenLastCalledWith('Show the next step')
  expect(onSend).toHaveBeenCalledTimes(2)
})

it('makes a new line on Shift+Enter', async () => {
  const onSend = vi.fn()
  render(<Page onSend={onSend} />)
  await userEvent.type(box(), '2x + 3 = 11{Shift>}{Enter}{/Shift}What is x?')
  expect(onSend).not.toHaveBeenCalled()
  expect(box()).toHaveValue('2x + 3 = 11\nWhat is x?')
})

it('does not send on the Enter that picks a word in an input method', () => {
  const onSend = vi.fn()
  render(<Page onSend={onSend} start="三角形" />)
  fireEvent.keyDown(box(), { key: 'Enter', isComposing: true })
  expect(onSend).not.toHaveBeenCalled()
  fireEvent.keyDown(box(), { key: 'Enter' })
  expect(onSend).toHaveBeenCalledWith('三角形')
})

it('cannot send when the text is empty or only spaces', async () => {
  const onSend = vi.fn()
  render(<Page onSend={onSend} />)
  expect(sendButton()).toBeDisabled()
  await userEvent.type(box(), '   {Enter}')
  expect(sendButton()).toBeDisabled()
  expect(onSend).not.toHaveBeenCalled()
  expect(box()).toHaveValue('   ')
  await userEvent.type(box(), 'x')
  expect(sendButton()).toBeEnabled()
})

it('stops when disabled', () => {
  const onSend = vi.fn()
  render(<Page onSend={onSend} start="Why subtract 3?" disabled />)
  expect(box()).toBeDisabled()
  expect(sendButton()).toBeDisabled()
})

it('speaks the page\'s language', () => {
  render(
    <LocaleProvider locale="es">
      <Composer label="Pregunta a Gauth AI" value="x" onChange={() => {}} onSend={() => {}} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled()
  expect(screen.getByText('Revisa que las respuestas de la IA sean correctas. Sigue las normas de tu escuela.')).toBeInTheDocument()
})

it('takes its own note in place of the default', () => {
  render(<Composer label="Ask Gauth AI" value="" onChange={() => {}} onSend={() => {}} note="Gauth AI sees this problem and your work." />)
  expect(screen.getByText('Gauth AI sees this problem and your work.')).toHaveClass('gx-composer__note')
  expect(screen.queryByText(/Review AI output/)).not.toBeInTheDocument()
})
