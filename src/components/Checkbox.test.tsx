import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

it('is a checkbox named by its text, and a click on the text reports the other state', async () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <Checkbox checked={false} onChange={onChange} className="mine">
      A-REI.B.3 Solve linear equations
    </Checkbox>,
  )
  const box = screen.getByRole('checkbox', { name: 'A-REI.B.3 Solve linear equations' })
  expect(box).not.toBeChecked()
  expect(box.closest('label')).toHaveClass('gx-checkbox', 'mine')
  await userEvent.click(screen.getByText('A-REI.B.3 Solve linear equations'))
  expect(onChange).toHaveBeenLastCalledWith(true)
  rerender(
    <Checkbox checked onChange={onChange}>
      A-REI.B.3 Solve linear equations
    </Checkbox>,
  )
  expect(box).toBeChecked()
})

it('works with the keyboard', async () => {
  const onChange = vi.fn()
  render(
    <Checkbox checked onChange={onChange}>
      A-CED.A.1 Write equations
    </Checkbox>,
  )
  await userEvent.tab()
  expect(screen.getByRole('checkbox')).toHaveFocus()
  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenLastCalledWith(false)
})

it('takes its name from label when it has no text, and is not wrapped in a label', async () => {
  const onChange = vi.fn()
  render(<Checkbox label="Select Maya Johnson" checked={false} onChange={onChange} />)
  const box = screen.getByRole('checkbox', { name: 'Select Maya Johnson' })
  expect(box.closest('label')).toBeNull()
  expect(box.parentElement).toHaveClass('gx-checkbox')
  await userEvent.click(box)
  expect(onChange).toHaveBeenLastCalledWith(true)
})

it('does not change when disabled', async () => {
  const onChange = vi.fn()
  render(
    <Checkbox checked={false} onChange={onChange} disabled>
      A-CED.A.1 Write equations
    </Checkbox>,
  )
  expect(screen.getByRole('checkbox')).toBeDisabled()
  await userEvent.click(screen.getByText('A-CED.A.1 Write equations'))
  expect(onChange).not.toHaveBeenCalled()
})
