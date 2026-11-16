import { render, screen, within } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Breadcrumbs } from './Breadcrumbs'

it('is a named trail whose last item is the current page', () => {
  render(
    <Breadcrumbs className="mine">
      <a href="/classes">Classes</a>
      <a href="/classes/geometry-3">Geometry · Period 3</a>
      Needs support
    </Breadcrumbs>,
  )
  const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
  expect(nav).toHaveClass('gx-breadcrumbs', 'mine')
  const items = within(nav).getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).not.toHaveAttribute('aria-current')
  expect(items[1]).not.toHaveAttribute('aria-current')
  expect(items[2]).toHaveAttribute('aria-current', 'page')
  expect(items[2]).toHaveTextContent('Needs support')
  expect(within(nav).getByRole('link', { name: 'Classes' })).toHaveAttribute('href', '/classes')
})

it('marks no current page when every item is a link', () => {
  render(
    <Breadcrumbs>
      <a href="/classes">Classes</a>
      <a href="/classes/geometry-3">Geometry · Period 3</a>
    </Breadcrumbs>,
  )
  for (const item of screen.getAllByRole('listitem')) expect(item).not.toHaveAttribute('aria-current')
})

it('puts a chevron between items and none after the last', () => {
  const { container } = render(
    <Breadcrumbs>
      <a href="/classes">Classes</a>
      <span>Geometry · Period 3</span>
    </Breadcrumbs>,
  )
  expect(container.querySelectorAll('svg')).toHaveLength(1)
  expect(screen.getAllByRole('listitem')[1]!.querySelector('svg')).toBeNull()
})

it("is named in the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <Breadcrumbs>Clases</Breadcrumbs>
    </LocaleProvider>,
  )
  expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeInTheDocument()
})
