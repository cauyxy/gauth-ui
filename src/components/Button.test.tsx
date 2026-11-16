import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, buttonClass } from './Button'

it('is an ink, medium button that does not submit a form by default', () => {
  render(<Button>Start</Button>)
  const button = screen.getByRole('button', { name: 'Start' })
  expect(button).toHaveClass('gx-btn', 'gx-btn--ink', 'gx-btn--md')
  expect(button).toHaveAttribute('type', 'button')
})

it("takes a variant, a size and the caller's class", () => {
  render(
    <Button variant="outline" size="xl" className="mine">
      Review
    </Button>,
  )
  expect(screen.getByRole('button')).toHaveClass('gx-btn--outline', 'gx-btn--xl', 'mine')
})

it('works with the keyboard and stops when disabled', async () => {
  const onClick = vi.fn()
  const { rerender } = render(<Button onClick={onClick}>Send</Button>)
  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  expect(onClick).toHaveBeenCalledTimes(1)
  rerender(
    <Button onClick={onClick} disabled>
      Send
    </Button>,
  )
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

it('puts the look on a link with asChild', () => {
  render(
    <Button asChild variant="soft">
      <a href="/next">Next</a>
    </Button>,
  )
  const link = screen.getByRole('link', { name: 'Next' })
  expect(link).toHaveClass('gx-btn', 'gx-btn--soft')
  expect(link).not.toHaveAttribute('type')
})

it('gives the same look as a class string', () => {
  const classes = buttonClass({ variant: 'outline' }, 'flex-none bg-surface').split(' ')
  expect(classes).toEqual(expect.arrayContaining(['gx-btn', 'gx-btn--outline', 'gx-btn--md', 'flex-none', 'shadow-edge-strong']))
  /* A class from the product replaces the one it conflicts with. */
  expect(classes).toContain('bg-surface')
  expect(classes).not.toContain('bg-white')
})
