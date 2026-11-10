import { render, screen } from '@testing-library/react'
import { AiStatus } from './AiStatus'

it('is one status with a spinner while Gauth AI works', () => {
  const { container } = render(
    <AiStatus state="working" className="mine">
      Reading 28 answers
    </AiStatus>,
  )
  const status = screen.getByRole('status')
  expect(screen.getAllByRole('status')).toHaveLength(1)
  expect(status).toHaveClass('gx-ai-status', 'mine')
  expect(status).toHaveAttribute('data-state', 'working')
  expect(status).toHaveTextContent('Reading 28 answers')
  expect(container.querySelector('.gx-spinner')).toHaveStyle({ width: '14px', height: '14px' })
  expect(container.querySelector('.gx-ai-status__mark')).toHaveAttribute('aria-hidden', 'true')
})

it('is the text alone when the work is done', () => {
  const { container } = render(<AiStatus state="done">Read 28 answers in Period 3</AiStatus>)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getByText('Read 28 answers in Period 3')).toBeInTheDocument()
  expect(container.firstElementChild).toHaveAttribute('data-state', 'done')
  expect(container.querySelector('.gx-spinner, svg')).toBeNull()
})

it('keeps one line when the work ends', () => {
  const { rerender, container } = render(<AiStatus state="working">Reading 28 answers</AiStatus>)
  const line = container.firstElementChild
  rerender(<AiStatus state="done">Read 28 answers in Period 3</AiStatus>)
  expect(container.firstElementChild).toBe(line)
  expect(line).toHaveTextContent('Read 28 answers in Period 3')
})
