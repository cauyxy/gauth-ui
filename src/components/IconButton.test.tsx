import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Icon } from '../core/Icon'
import { IconButton } from './IconButton'

it('is a button named by its label', async () => {
  const onClick = vi.fn()
  render(
    <IconButton label="Print" onClick={onClick} className="mine">
      <Icon name="printer" />
    </IconButton>,
  )
  const button = screen.getByRole('button', { name: 'Print' })
  expect(button).toHaveClass('gx-icon-btn', 'gx-icon-btn--ghost', 'gx-icon-btn--md', 'mine')
  expect(button).toHaveAttribute('type', 'button')
  expect(button).not.toHaveAttribute('aria-pressed')
  await userEvent.click(button)
  expect(onClick).toHaveBeenCalledOnce()
})

it('is a toggle when it has pressed', () => {
  const { rerender } = render(
    <IconButton label="Good reply" pressed={false}>
      <Icon name="thumbs-up" />
    </IconButton>,
  )
  expect(screen.getByRole('button', { name: 'Good reply' })).toHaveAttribute('aria-pressed', 'false')
  rerender(
    <IconButton label="Good reply" pressed size="sm" variant="outline">
      <Icon name="thumbs-up" />
    </IconButton>,
  )
  expect(screen.getByRole('button', { name: 'Good reply', pressed: true })).toHaveClass('gx-icon-btn--sm', 'gx-icon-btn--outline')
})
