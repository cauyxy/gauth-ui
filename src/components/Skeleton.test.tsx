import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { PageSkeleton, Skeleton } from './Skeleton'

it('hides a block from screen readers', () => {
  const { container } = render(<Skeleton className="mine" />)
  expect(container.firstChild).toHaveClass('gx-skeleton', 'mine')
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
})

it('announces a loading page and draws the asked panels and rows', () => {
  const { container } = render(<PageSkeleton panels={3} rows={2} />)
  expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  expect(container.querySelectorAll('.gx-page-skeleton__panel')).toHaveLength(3)
  expect(container.querySelectorAll('.gx-page-skeleton__row')).toHaveLength(6)
})

it("says Loading in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <PageSkeleton />
    </LocaleProvider>,
  )
  expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
})
