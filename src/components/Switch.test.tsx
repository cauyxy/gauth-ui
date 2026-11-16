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

it('keeps its own state without `checked`', async () => {
  const onChange = vi.fn()
  render(<Switch label="Show hints" defaultChecked onChange={onChange} />)
  const control = screen.getByRole('switch', { name: 'Show hints' })
  expect(control).toBeChecked()
  await userEvent.click(control)
  expect(control).not.toBeChecked()
  expect(onChange).toHaveBeenLastCalledWith(false)
})

it('goes with a form while it is on, as a checkbox does', async () => {
  render(
    <form aria-label="Settings">
      <Switch label="Show hints" name="hints" />
    </form>,
  )
  const form = screen.getByRole<HTMLFormElement>('form')
  expect(new FormData(form).has('hints')).toBe(false)
  await userEvent.click(screen.getByRole('switch'))
  expect(new FormData(form).get('hints')).toBe('on')
})

it('runs the product’s onClick first, which can stop the change', async () => {
  render(<Switch label="Show hints" onClick={(event) => event.preventDefault()} />)
  await userEvent.click(screen.getByRole('switch'))
  expect(screen.getByRole('switch')).not.toBeChecked()
})
