import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion, AccordionItem } from './Accordion'

function Unit({ type = 'single' }: { type?: 'single' | 'multiple' }) {
  const items = (
    <>
      <AccordionItem value="1" title="Lesson 1: Ratios" meta="4 skills">
        Equivalent ratios and tables.
      </AccordionItem>
      <AccordionItem value="2" title="Lesson 2: Rates">
        Unit rates and speed.
      </AccordionItem>
      <AccordionItem value="3" title="Lesson 3: Percent" disabled>
        Not open yet.
      </AccordionItem>
    </>
  )
  return type === 'single' ? (
    <Accordion type="single" collapsible className="mine">
      {items}
    </Accordion>
  ) : (
    <Accordion type="multiple">{items}</Accordion>
  )
}

it('opens a section from its title and closes it again', async () => {
  const { container } = render(<Unit />)
  expect(container.firstElementChild).toHaveClass('gx-accordion', 'mine')
  const first = screen.getByRole('button', { name: /Lesson 1: Ratios/ })
  expect(first).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText('Equivalent ratios and tables.')).not.toBeInTheDocument()
  await userEvent.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('region', { name: /Lesson 1: Ratios/ })).toHaveTextContent('Equivalent ratios and tables.')
  await userEvent.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'false')
})

it('keeps one open when single, and lets each open when multiple', async () => {
  const { unmount } = render(<Unit />)
  await userEvent.click(screen.getByRole('button', { name: /Lesson 1/ }))
  await userEvent.click(screen.getByRole('button', { name: /Lesson 2/ }))
  expect(screen.getByRole('button', { name: /Lesson 1/ })).toHaveAttribute('aria-expanded', 'false')
  unmount()
  render(<Unit type="multiple" />)
  await userEvent.click(screen.getByRole('button', { name: /Lesson 1/ }))
  await userEvent.click(screen.getByRole('button', { name: /Lesson 2/ }))
  expect(screen.getByRole('button', { name: /Lesson 1/ })).toHaveAttribute('aria-expanded', 'true')
})

it('moves between titles with the arrow keys and skips a disabled one', async () => {
  render(<Unit />)
  await userEvent.tab()
  expect(screen.getByRole('button', { name: /Lesson 1/ })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}')
  expect(screen.getByRole('button', { name: /Lesson 2/ })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}')
  expect(screen.getByRole('button', { name: /Lesson 1/ })).toHaveFocus()
  expect(screen.getByRole('button', { name: /Lesson 3/ })).toBeDisabled()
})
