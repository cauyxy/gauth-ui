import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Input } from './Input'

function Harness({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <Input
      aria-label="Class code"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

it('is a medium outline text box that reports the new value, not the event', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  const input = screen.getByRole('textbox', { name: 'Class code' })
  expect(input.parentElement).toHaveClass('gx-input', 'gx-input--md', 'gx-input--outline')
  await userEvent.tab()
  expect(input).toHaveFocus()
  await userEvent.keyboard('GEO')
  expect(onChange).toHaveBeenLastCalledWith('GEO')
  expect(input).toHaveValue('GEO')
})

it("takes a size and the caller's class on the wrapper, and passes native props to the input", () => {
  render(<Input size="xl" className="mine" label="Class code" placeholder="8 letters" maxLength={8} name="code" />)
  const input = screen.getByPlaceholderText('8 letters')
  expect(input.parentElement).toHaveClass('gx-input--xl', 'mine')
  expect(input).toHaveAttribute('maxlength', '8')
  expect(input).toHaveAttribute('name', 'code')
  expect(input).not.toHaveAttribute('size')
})

it('shows the search icon in the search variant only', () => {
  const { container, rerender } = render(<Input variant="search" aria-label="Find a student" />)
  expect(screen.getByRole('textbox', { name: 'Find a student' }).parentElement).toHaveClass('gx-input--search')
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  rerender(<Input aria-label="Find a student" />)
  expect(container.querySelector('svg')).not.toBeInTheDocument()
})

it('does not take text when disabled, and can be invalid without a Field', async () => {
  const onChange = vi.fn()
  render(<Input aria-label="Class code" disabled aria-invalid value="" onChange={onChange} />)
  const input = screen.getByRole('textbox', { name: 'Class code' })
  expect(input).toBeDisabled()
  expect(input).toBeInvalid()
  await userEvent.type(input, 'G')
  expect(onChange).not.toHaveBeenCalled()
})
