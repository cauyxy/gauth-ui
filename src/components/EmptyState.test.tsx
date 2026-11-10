import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

it('shows a title alone, with no empty parts', () => {
  const { container } = render(<EmptyState title="No practice sent yet" className="mine" />)
  expect(container.firstChild).toHaveClass('gx-empty-state', 'mine')
  expect(screen.getByText('No practice sent yet')).toHaveClass('gx-empty-state__title')
  expect(container.querySelector('.gx-empty-state__description, .gx-empty-state__action, .gx-empty-state__icon')).toBeNull()
})

it('shows the description, the icon and an action that works', async () => {
  const onClick = vi.fn()
  render(
    <EmptyState
      icon={<svg data-testid="icon" />}
      title="No practice sent yet"
      description="Pick a skill the class needs."
      action={<Button onClick={onClick}>Send practice</Button>}
    />,
  )
  expect(screen.getByText('Pick a skill the class needs.')).toHaveClass('gx-empty-state__description')
  expect(screen.getByTestId('icon').parentElement).toHaveClass('gx-empty-state__icon')
  await userEvent.click(screen.getByRole('button', { name: 'Send practice' }))
  expect(onClick).toHaveBeenCalledTimes(1)
})
