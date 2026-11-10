import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from './Chip'
import { CoverCard } from './CoverCard'

it('is one button that holds the cover, the title and the line', async () => {
  const onClick = vi.fn()
  render(
    <CoverCard
      cover={<img src="exit-ticket.png" alt="" />}
      title="Exit ticket: similar triangles"
      description="5 questions on HSG.SRT.B.5"
      onClick={onClick}
      className="mine"
    />,
  )
  const card = screen.getByRole('button', { name: /Exit ticket: similar triangles/ })
  expect(card).toHaveClass('gx-cover-card', 'mine')
  expect(card).toHaveAttribute('type', 'button')
  expect(card).not.toHaveAttribute('title')
  expect(card.querySelector('.gx-cover-card__cover > img')).toBeInTheDocument()
  expect(screen.getByText('5 questions on HSG.SRT.B.5')).toHaveClass('gx-cover-card__description')
  await userEvent.click(card)
  expect(onClick).toHaveBeenCalledOnce()
})

it('is a link when it has href, and passes anchor props through', () => {
  render(<CoverCard href="/tools/worksheet" target="_blank" cover={null} title="Worksheet" description="Practice problems with an answer key" />)
  const card = screen.getByRole('link', { name: /Worksheet/ })
  expect(card).toHaveClass('gx-cover-card')
  expect(card).toHaveAttribute('href', '/tools/worksheet')
  expect(card).toHaveAttribute('target', '_blank')
  expect(card).not.toHaveAttribute('type')
})

it('shows meta under the line, and leaves out what it does not get', () => {
  const { rerender } = render(<CoverCard cover={null} title="Unit 4 review" meta={<Chip>Geometry · Period 3</Chip>} />)
  const card = screen.getByRole('button', { name: /Unit 4 review/ })
  expect(screen.getByText('Geometry · Period 3').parentElement).toHaveClass('gx-cover-card__meta')
  expect(card.querySelector('.gx-cover-card__description')).toBeNull()
  rerender(<CoverCard cover={null} title="Unit 4 review" />)
  expect(card.querySelector('.gx-cover-card__meta')).toBeNull()
})

it('passes button props through', () => {
  render(<CoverCard cover={null} title="Unit 4 review" name="document" />)
  expect(screen.getByRole('button', { name: 'Unit 4 review' })).toHaveAttribute('name', 'document')
})
