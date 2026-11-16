import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { IconButton } from '../components/IconButton'
import { Icon } from '../core/Icon'
import { LocaleProvider } from '../core/locale'
import { Composer } from './Composer'
import { Quote } from './Quote'

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

it("speaks the page's language", () => {
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

it('shows the rows of before inside the box, above the text', async () => {
  const onRemove = vi.fn()
  const { container } = render(
    <Composer label="Ask Gauth AI" value="" onChange={() => {}} onSend={() => {}} before={<Quote onRemove={onRemove}>Six students added the legs.</Quote>} />,
  )
  const quote = screen.getByRole('blockquote')
  expect(quote.closest('.gx-composer__box')).toBe(container.querySelector('.gx-composer__box'))
  expect(quote.compareDocumentPosition(box()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
  expect(onRemove).toHaveBeenCalledOnce()
})

it('puts tools on a second row before Send, and keeps one row without them', async () => {
  const onAttach = vi.fn()
  const tools = (
    <>
      <IconButton label="Attach a file" onClick={onAttach}>
        <Icon name="attach" />
      </IconButton>
      <IconButton label="Dictate">
        <Icon name="mic" />
      </IconButton>
    </>
  )
  const { container, rerender } = render(<Composer label="Ask Gauth AI" value="x" onChange={() => {}} onSend={() => {}} tools={tools} />)
  expect(container.querySelector('.gx-composer__box')).toHaveClass('gx-composer__box--tools')
  await userEvent.click(box())
  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'Attach a file' })).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onAttach).toHaveBeenCalledOnce()
  await userEvent.tab()
  await userEvent.tab()
  expect(sendButton()).toHaveFocus()

  rerender(<Composer label="Ask Gauth AI" value="x" onChange={() => {}} onSend={() => {}} />)
  expect(container.querySelector('.gx-composer__box')).not.toHaveClass('gx-composer__box--tools')
  expect(container.querySelector('.gx-composer__box')!.children).toHaveLength(2)
})

it('turns Send into Stop while Gauth AI writes', async () => {
  const onSend = vi.fn()
  const onStop = vi.fn()
  const { rerender } = render(<Composer label="Ask Gauth AI" value="" onChange={() => {}} onSend={onSend} busy onStop={onStop} />)
  expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument()
  const stop = screen.getByRole('button', { name: 'Stop' })
  expect(stop).toBeEnabled()
  await userEvent.click(stop)
  expect(onStop).toHaveBeenCalledOnce()
  expect(onSend).not.toHaveBeenCalled()

  rerender(<Composer label="Ask Gauth AI" value="" onChange={() => {}} onSend={onSend} onStop={onStop} />)
  expect(sendButton()).toBe(stop)
  expect(sendButton()).toBeDisabled()
})

it('does not send on Enter while Gauth AI writes, and keeps the text', async () => {
  const onSend = vi.fn()
  const onStop = vi.fn()
  function Busy() {
    const [value, setValue] = useState('')
    return <Composer label="Ask Gauth AI" value={value} onChange={setValue} onSend={onSend} busy onStop={onStop} />
  }
  render(<Busy />)
  await userEvent.type(box(), 'Which students?{Enter}')
  expect(onSend).not.toHaveBeenCalled()
  expect(onStop).not.toHaveBeenCalled()
  expect(box()).toHaveValue('Which students?')
})

it('keeps Stop on when the text box is off, and has no Stop to press without onStop', () => {
  const { rerender } = render(<Composer label="Ask Gauth AI" value="" onChange={() => {}} onSend={() => {}} busy onStop={() => {}} disabled />)
  expect(box()).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Stop' })).toBeEnabled()
  rerender(<Composer label="Ask Gauth AI" value="x" onChange={() => {}} onSend={() => {}} busy />)
  expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
})

it("names Stop in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <Composer label="Pregunta a Gauth AI" value="" onChange={() => {}} onSend={() => {}} busy onStop={() => {}} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('button', { name: 'Detener' })).toBeEnabled()
})
