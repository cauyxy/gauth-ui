import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../core/locale'
import { Pagination } from './Pagination'
import { pagesOf } from './Pagination.pages'

it('shows every page up to seven, and the ends and the neighbours past that', () => {
  expect(pagesOf(1, 5)).toEqual([1, 2, 3, 4, 5])
  expect(pagesOf(1, 20)).toEqual([1, 2, 3, 4, null, 20])
  expect(pagesOf(10, 20)).toEqual([1, null, 9, 10, 11, null, 20])
  expect(pagesOf(19, 20)).toEqual([1, null, 17, 18, 19, 20])
})

it('is a named nav with the current page marked', () => {
  render(<Pagination page={3} count={5} onChange={() => {}} className="mine" />)
  const nav = screen.getByRole('navigation', { name: 'Pages' })
  expect(nav).toHaveClass('gx-pagination', 'mine')
  expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute('aria-current')
})

it('moves back, forward and to a page, and stops at the ends', async () => {
  const onChange = vi.fn<(page: number) => void>()
  const { rerender } = render(<Pagination page={1} count={5} onChange={onChange} />)
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
  expect(onChange).toHaveBeenLastCalledWith(2)
  await userEvent.click(screen.getByRole('button', { name: 'Page 4' }))
  expect(onChange).toHaveBeenLastCalledWith(4)
  rerender(<Pagination page={5} count={5} onChange={onChange} />)
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
})

it('is not there for one page, and speaks Spanish', () => {
  const { container } = render(<Pagination page={1} count={1} onChange={() => {}} />)
  expect(container).toBeEmptyDOMElement()
  render(
    <LocaleProvider locale="es">
      <Pagination page={1} count={3} onChange={() => {}} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('navigation', { name: 'Páginas' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument()
})
