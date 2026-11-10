import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from './Menu'

function StudentMenu({ onSelect = () => {} }: { onSelect?: (action: string) => void }) {
  return (
    <Menu>
      <MenuTrigger>Devon Carter</MenuTrigger>
      <MenuContent>
        <MenuItem onSelect={() => onSelect('progress')}>View progress</MenuItem>
        <MenuItem onSelect={() => onSelect('practice')}>Send practice</MenuItem>
        <MenuItem disabled onSelect={() => onSelect('message')}>
          Message family
        </MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => onSelect('remove')}>Remove from class</MenuItem>
      </MenuContent>
    </Menu>
  )
}

it('opens from its trigger, runs the picked item and closes', async () => {
  const onSelect = vi.fn()
  render(<StudentMenu onSelect={onSelect} />)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Devon Carter' }))
  const menu = await screen.findByRole('menu')
  expect(menu).toHaveClass('gx-menu')
  expect(screen.getAllByRole('menuitem')).toHaveLength(4)
  expect(screen.getByRole('separator')).toHaveClass('gx-menu__separator')
  await userEvent.click(screen.getByRole('menuitem', { name: 'Send practice' }))
  expect(onSelect).toHaveBeenCalledExactlyOnceWith('practice')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

it('works with the keyboard: Enter opens, the arrow keys move past a disabled item, Escape closes', async () => {
  const onSelect = vi.fn()
  render(<StudentMenu onSelect={onSelect} />)
  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  await screen.findByRole('menu')
  expect(screen.getByRole('menuitem', { name: 'View progress' })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}{ArrowDown}')
  expect(screen.getByRole('menuitem', { name: 'Remove from class' })).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onSelect).toHaveBeenCalledExactlyOnceWith('remove')

  await userEvent.keyboard('{Enter}')
  await screen.findByRole('menu')
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Devon Carter' })).toHaveFocus()
})

it('marks a disabled item and does not run it', async () => {
  const onSelect = vi.fn()
  render(<StudentMenu onSelect={onSelect} />)
  await userEvent.click(screen.getByRole('button', { name: 'Devon Carter' }))
  const item = await screen.findByRole('menuitem', { name: 'Message family' })
  expect(item).toHaveAttribute('aria-disabled', 'true')
  await userEvent.click(item, { pointerEventsCheck: 0 })
  expect(onSelect).not.toHaveBeenCalled()
})
