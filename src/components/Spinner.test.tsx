import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Spinner } from './Spinner'

it('is a status named Loading, in the page\'s language', () => {
  const { rerender } = render(<Spinner />)
  expect(screen.getByRole('status', { name: 'Loading' })).toHaveStyle({ width: '18px', height: '18px' })
  rerender(
    <LocaleProvider locale="es">
      <Spinner size={14} />
    </LocaleProvider>,
  )
  expect(screen.getByRole('status', { name: 'Cargando' })).toHaveStyle({ width: '14px' })
})

it('takes its own name', () => {
  render(<Spinner label="Uploading" />)
  expect(screen.getByRole('status', { name: 'Uploading' })).toHaveClass('gx-spinner')
})
