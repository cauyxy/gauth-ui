import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

it('is a named switch that reports the other state', async () => {
  const onChange = vi.fn()
  const { rerender } = render(<Switch label="Show hints" checked={false} onChange={onChange} />)
  const control = screen.getByRole('switch', { name: 'Show hints' })
  expect(control).not.toBeChecked()
  await userEvent.click(control)
  expect(onChange).toHaveBeenLastCalledWith(true)
  rerender(<Switch label="Show hints" checked onChange={onChange} />)
  expect(control).toBeChecked()
  control.focus()
  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenLastCalledWith(false)
})
