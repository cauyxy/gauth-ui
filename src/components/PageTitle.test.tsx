import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from './Breadcrumbs'
import { PageTitle } from './PageTitle'

it("is the page's h1", () => {
  const { container } = render(<PageTitle title="Needs support" className="mine" />)
  expect(screen.getByRole('heading', { level: 1, name: 'Needs support' })).toBeInTheDocument()
  expect(container.firstChild).toHaveClass('gx-page-title', 'mine')
  expect(container.querySelector('.gx-page-title__actions')).toBeNull()
})

it('shows the breadcrumbs above the title and the actions after it', () => {
  render(
    <PageTitle
      title="Needs support"
      crumbs={
        <Breadcrumbs>
          <a href="/classes">Classes</a>
          <a href="/classes/geometry-3">Geometry · Period 3</a>
        </Breadcrumbs>
      }
    >
      <button type="button">Send practice</button>
    </PageTitle>,
  )
  const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
  const heading = screen.getByRole('heading', { level: 1 })
  const action = screen.getByRole('button', { name: 'Send practice' })
  expect(nav.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(action.parentElement).toHaveClass('gx-page-title__actions')
})
