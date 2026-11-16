import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Slider } from './Slider'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserver

function Goal({ onChange }: { onChange?: (value: number) => void }) {
  const [value, setValue] = useState(10)
  return (
    <Slider
      label="Daily goal"
      min={5}
      max={30}
      step={5}
      value={value}
      formatValue={(n) => `${n} questions`}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      className="mine"
    />
  )
}

it('is a named slider that says its value in words', () => {
  const { container } = render(<Goal />)
  const thumb = screen.getByRole('slider', { name: 'Daily goal' })
  expect(container.firstElementChild).toHaveClass('gx-slider', 'mine')
  expect(thumb).toHaveAttribute('aria-valuenow', '10')
  expect(thumb).toHaveAttribute('aria-valuemin', '5')
  expect(thumb).toHaveAttribute('aria-valuemax', '30')
  expect(thumb).toHaveAttribute('aria-valuetext', '10 questions')
})

it('moves a step with the arrow keys and to the end with End', async () => {
  const onChange = vi.fn<(value: number) => void>()
  render(<Goal onChange={onChange} />)
  await userEvent.tab()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith(15)
  await userEvent.keyboard('{End}')
  expect(onChange).toHaveBeenLastCalledWith(30)
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '30 questions')
})

it('keeps its own number without `value`, starting at `defaultValue` or at `min`', async () => {
  const onChange = vi.fn()
  const { unmount } = render(<Slider label="Daily goal" min={5} max={30} step={5} defaultValue={10} onChange={onChange} />)
  const thumb = screen.getByRole('slider', { name: 'Daily goal' })
  expect(thumb).toHaveAttribute('aria-valuenow', '10')
  thumb.focus()
  await userEvent.keyboard('{ArrowRight}')
  expect(thumb).toHaveAttribute('aria-valuenow', '15')
  expect(onChange).toHaveBeenLastCalledWith(15)
  unmount()
  render(<Slider label="Daily goal" min={5} max={30} />)
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '5')
})
