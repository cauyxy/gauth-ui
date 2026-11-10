import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { Reveal } from './Reveal'

it('is a note named by its kind, with the content inside', () => {
  render(
    <Reveal kind="hint" className="mine">
      Which side is across from the right angle?
    </Reveal>,
  )
  const hint = screen.getByRole('note', { name: 'Hint' })
  expect(hint).toHaveClass('gx-reveal', 'gx-reveal--hint', 'mine')
  expect(hint).toHaveTextContent('Which side is across from the right angle?')
})

it('has its own look for why', () => {
  render(<Reveal kind="why">The hypotenuse is the longest side.</Reveal>)
  expect(screen.getByRole('note', { name: 'Why' })).toHaveClass('gx-reveal--why')
})

it('takes its title from the language of the page', () => {
  render(
    <LocaleProvider locale="es">
      <Reveal kind="hint">¿Qué lado está frente al ángulo recto?</Reveal>
      <Reveal kind="why">La hipotenusa es el lado más largo.</Reveal>
    </LocaleProvider>,
  )
  expect(screen.getByRole('note', { name: 'Pista' })).toBeInTheDocument()
  expect(screen.getByRole('note', { name: 'Por qué' })).toBeInTheDocument()
})
