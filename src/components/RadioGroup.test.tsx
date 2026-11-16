import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { RadioGroup } from './RadioGroup'

const options = [
  { value: 'now', label: 'Send now' },
  { value: 'later', label: 'Schedule', description: 'Students see it on the day you pick.' },
  { value: 'draft', label: 'Save as draft', disabled: true },
] as const
type When = (typeof options)[number]['value']

function Group({ onChange }: { onChange?: (value: When) => void }) {
  const [value, setValue] = useState<When>('now')
  return (
    <RadioGroup
      label="When"
      value={value}
      options={options}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      className="mine"
    />
  )
}

it('is a named radio group with the picked option checked', () => {
  render(<Group />)
  const group = screen.getByRole('radiogroup', { name: 'When' })
  expect(group).toHaveClass('gx-radio-group', 'gx-radio-group--vertical', 'mine')
  expect(screen.getByRole('radio', { name: 'Send now' })).toBeChecked()
  expect(screen.getByRole('radio', { name: /Schedule/ })).not.toBeChecked()
  expect(screen.getByText('Students see it on the day you pick.')).toHaveClass('gx-radio-group__description')
})

it('picks with a click on the text, and with the arrow keys as one Tab stop', async () => {
  const onChange = vi.fn<(value: When) => void>()
  render(<Group onChange={onChange} />)
  await userEvent.click(screen.getByText('Schedule'))
  expect(onChange).toHaveBeenLastCalledWith('later')
  expect(screen.getByRole('radio', { name: /Schedule/ })).toBeChecked()
  await userEvent.keyboard('{ArrowUp}')
  expect(screen.getByRole('radio', { name: 'Send now' })).toHaveFocus()
  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenLastCalledWith('now')
  await userEvent.tab()
  expect(document.body).toHaveFocus()
})

it('does not pick a disabled option', async () => {
  const onChange = vi.fn()
  render(<Group onChange={onChange} />)
  expect(screen.getByRole('radio', { name: 'Save as draft' })).toBeDisabled()
  await userEvent.click(screen.getByText('Save as draft'))
  expect(onChange).not.toHaveBeenCalled()
})
