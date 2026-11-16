import { render, screen } from '@testing-library/react'
import { Prose, type ProseSize } from './Prose'

it('holds the text and takes a class and native props on its root', () => {
  render(
    <Prose className="mine" data-testid="lesson" lang="es">
      <h2>Similar triangles</h2>
      <p>Two triangles are similar when their angles match.</p>
    </Prose>,
  )
  const root = screen.getByTestId('lesson')
  expect(root).toHaveClass('gx-prose', 'gx-prose--md', 'mine')
  expect(root).toHaveAttribute('lang', 'es')
  expect(screen.getByRole('heading', { level: 2, name: 'Similar triangles' })).toBeInTheDocument()
  expect(root).toHaveTextContent('Two triangles are similar when their angles match.')
})

it.each<[ProseSize, string]>([
  ['sm', 'text-sm'],
  ['md', 'text-base'],
  ['lg', 'text-lg'],
])('at %s the running text is %s', (size, text) => {
  render(
    <Prose size={size} data-testid="text">
      <p>Read the passage.</p>
    </Prose>,
  )
  expect(screen.getByTestId('text')).toHaveClass(`gx-prose--${size}`, text)
})

it("lets a product's class replace its width", () => {
  render(
    <Prose className="max-w-doc" data-testid="wide">
      <p>A plan is wider than a lesson.</p>
    </Prose>,
  )
  expect(screen.getByTestId('wide')).toHaveClass('max-w-doc')
  expect(screen.getByTestId('wide')).not.toHaveClass('max-w-read')
})

it('adds no class to what it holds: a component inside keeps its own', () => {
  render(
    <Prose>
      <p className="text-muted">Meta</p>
      <a href="#next">Next lesson</a>
    </Prose>,
  )
  expect(screen.getByText('Meta').className).toBe('text-muted')
  expect(screen.getByRole('link', { name: 'Next lesson' }).className).toBe('')
})
