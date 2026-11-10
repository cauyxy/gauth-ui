import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../core/locale'
import { Button } from './Button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog'

function RemoveStudent({ onRemove }: { onRemove?: () => void }) {
  return (
    <Dialog>
      <DialogTrigger>Remove from class</DialogTrigger>
      <DialogContent title="Remove Devon from this class?" description="Devon keeps the practice already done.">
        <DialogClose asChild>
          <Button variant="soft">Cancel</Button>
        </DialogClose>
        <Button onClick={onRemove}>Remove</Button>
      </DialogContent>
    </Dialog>
  )
}

it('opens from its trigger with its name and description, and closes on Escape', async () => {
  render(<RemoveStudent />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Remove from class' }))
  const dialog = await screen.findByRole('dialog', { name: 'Remove Devon from this class?' })
  expect(dialog).toHaveClass('gx-dialog')
  expect(dialog).toHaveAccessibleDescription('Devon keeps the practice already done.')
  expect(dialog).not.toHaveAttribute('title')
  expect(document.querySelector('.gx-dialog__scrim')).toBeInTheDocument()
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Remove from class' })).toHaveFocus()
})

it('puts focus on the first control of the body, not on the close button', async () => {
  render(<RemoveStudent />)
  await userEvent.click(screen.getByRole('button', { name: 'Remove from class' }))
  await screen.findByRole('dialog')
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
})

it('closes on its close button and on a DialogClose in the body', async () => {
  render(<RemoveStudent />)
  await userEvent.click(screen.getByRole('button', { name: 'Remove from class' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Remove from class' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('keeps the caller in charge when it is controlled', async () => {
  const onOpenChange = vi.fn()
  render(
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent title="Send practice to Period 3?" className="mine">
        <Button>Send practice</Button>
      </DialogContent>
    </Dialog>,
  )
  const dialog = screen.getByRole('dialog', { name: 'Send practice to Period 3?' })
  expect(dialog).toHaveClass('gx-dialog', 'mine')
  expect(dialog).not.toHaveAttribute('aria-describedby')
  await userEvent.keyboard('{Escape}')
  expect(onOpenChange).toHaveBeenCalledWith(false)
  expect(dialog).toBeInTheDocument()
})

it('names its close button in the language of the page', async () => {
  render(
    <LocaleProvider locale="es">
      <RemoveStudent />
    </LocaleProvider>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Remove from class' }))
  expect(await screen.findByRole('button', { name: 'Cerrar' })).toHaveClass('gx-dialog__close')
})
