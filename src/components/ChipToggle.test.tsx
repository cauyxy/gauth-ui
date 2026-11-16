import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Icon } from '../core/Icon'
import { ChipToggle } from './ChipToggle'

it('is a small button that says if it is pressed', () => {
  render(
    <ChipToggle pressed={false} onChange={() => {}} className="mine">
      Needs support
    </ChipToggle>,
  )
  const chip = screen.getByRole('button', { name: 'Needs support', pressed: false })
  expect(chip).toHaveClass('gx-chip-toggle', 'gx-chip-toggle--sm', 'mine')
  expect(chip).toHaveAttribute('type', 'button')
})

it('reports the new state, not the event', async () => {
  const onChange = vi.fn<(pressed: boolean) => void>()
  const { rerender } = render(
    <ChipToggle pressed={false} onChange={onChange}>
      Late
    </ChipToggle>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Late' }))
  expect(onChange).toHaveBeenLastCalledWith(true)
  rerender(
    <ChipToggle pressed onChange={onChange}>
      Late
    </ChipToggle>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Late', pressed: true }))
  expect(onChange).toHaveBeenLastCalledWith(false)
})

it('turns on and off from the keyboard', async () => {
  function Filter() {
    const [pressed, setPressed] = useState(false)
    return (
      <ChipToggle pressed={pressed} onChange={setPressed}>
        Late
      </ChipToggle>
    )
  }
  render(<Filter />)
  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'Late' })).toHaveFocus()
  await userEvent.keyboard(' ')
  expect(screen.getByRole('button', { name: 'Late', pressed: true })).toBeInTheDocument()
  await userEvent.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'Late', pressed: false })).toBeInTheDocument()
})

it('takes a size and an icon, and the icon is not part of its name', () => {
  render(
    <ChipToggle size="md" pressed onChange={() => {}}>
      <Icon name="file" />
      Worksheet
    </ChipToggle>,
  )
  const chip = screen.getByRole('button', { name: 'Worksheet' })
  expect(chip).toHaveClass('gx-chip-toggle--md')
  expect(chip.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
})

it('does not change when disabled', async () => {
  const onChange = vi.fn()
  render(
    <ChipToggle pressed={false} onChange={onChange} disabled>
      Late
    </ChipToggle>,
  )
  expect(screen.getByRole('button', { name: 'Late' })).toBeDisabled()
  await userEvent.click(screen.getByRole('button', { name: 'Late' }))
  expect(onChange).not.toHaveBeenCalled()
})

it('keeps its own state without `pressed`', async () => {
  const onChange = vi.fn()
  render(<ChipToggle onChange={onChange}>Fractions</ChipToggle>)
  const chip = screen.getByRole('button', { name: 'Fractions' })
  expect(chip).toHaveAttribute('aria-pressed', 'false')
  await userEvent.click(chip)
  expect(chip).toHaveAttribute('aria-pressed', 'true')
  expect(onChange).toHaveBeenLastCalledWith(true)
})
