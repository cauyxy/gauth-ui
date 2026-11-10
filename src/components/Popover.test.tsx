import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

it('opens from its trigger and closes on Escape', async () => {
  render(
    <Popover>
      <PopoverTrigger>Why this one</PopoverTrigger>
      <PopoverContent>Six students missed this step.</PopoverContent>
    </Popover>,
  )
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Why this one' }))
  const dialog = await screen.findByRole('dialog')
  expect(dialog).toHaveClass('gx-popover')
  expect(dialog).toHaveTextContent('Six students missed this step.')
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
