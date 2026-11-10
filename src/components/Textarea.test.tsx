import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Textarea } from './Textarea'

function Harness({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <Textarea
      aria-label="Note to students"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

it('is a medium, three-row text box that reports the new value, not the event', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  const textarea = screen.getByRole('textbox', { name: 'Note to students' })
  expect(textarea).toHaveClass('gx-textarea', 'gx-textarea--md')
  expect(textarea).toHaveAttribute('rows', '3')
  await userEvent.tab()
  expect(textarea).toHaveFocus()
  await userEvent.keyboard('Show{Enter}work')
  expect(onChange).toHaveBeenLastCalledWith('Show\nwork')
  expect(textarea).toHaveValue('Show\nwork')
})

it('takes a size, rows, the caller\'s class and native props', () => {
  render(<Textarea size="xl" rows={5} className="mine" aria-label="Note to students" placeholder="Show your work" name="note" />)
  const textarea = screen.getByRole('textbox', { name: 'Note to students' })
  expect(textarea).toHaveClass('gx-textarea--xl', 'mine')
  expect(textarea).toHaveAttribute('rows', '5')
  expect(textarea).toHaveAttribute('name', 'note')
})

it('does not take text when disabled, and can be invalid without a Field', async () => {
  const onChange = vi.fn()
  render(<Textarea aria-label="Note to students" disabled aria-invalid value="" onChange={onChange} />)
  const textarea = screen.getByRole('textbox', { name: 'Note to students' })
  expect(textarea).toBeDisabled()
  expect(textarea).toBeInvalid()
  await userEvent.type(textarea, 'S')
  expect(onChange).not.toHaveBeenCalled()
})
