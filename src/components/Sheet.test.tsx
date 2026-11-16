import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import { Sheet, SheetContent, SheetTrigger } from './Sheet'

function Details({ side }: { side?: 'start' | 'end' }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Maya Johnson</Button>
      </SheetTrigger>
      <SheetContent title="Maya Johnson" description="Geometry · Period 3" side={side}>
        <Button variant="soft">Send practice</Button>
      </SheetContent>
    </Sheet>
  )
}

it('opens from its trigger as a named dialog at the end edge, and closes on Escape', async () => {
  render(<Details />)
  await userEvent.click(screen.getByRole('button', { name: 'Maya Johnson' }))
  const sheet = await screen.findByRole('dialog', { name: 'Maya Johnson' })
  expect(sheet).toHaveClass('gx-sheet', 'gx-sheet--end')
  expect(sheet).toHaveAccessibleDescription('Geometry · Period 3')
  expect(screen.getByRole('button', { name: 'Send practice' })).toHaveFocus()
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Maya Johnson' })).toHaveFocus()
})

it('comes from the start edge, and closes with its close button', async () => {
  render(<Details side="start" />)
  await userEvent.click(screen.getByRole('button', { name: 'Maya Johnson' }))
  expect(await screen.findByRole('dialog')).toHaveClass('gx-sheet--start')
  await userEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
