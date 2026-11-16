import { render, screen } from '@testing-library/react'
import { Avatar, fillOf, initialsOf } from './Avatar'

it('leaves titles out of the initials', () => {
  expect(initialsOf('Ms. Carter')).toBe('C')
  expect(initialsOf('Rachel Carter')).toBe('RC')
  expect(initialsOf('Maria de la Cruz')).toBe('MC')
})

it('gives a name the same fill every time', () => {
  expect(fillOf('Rachel Carter')).toBe(fillOf('Rachel Carter'))
  expect(fillOf('Rachel Carter')).toBeGreaterThanOrEqual(1)
  expect(fillOf('Rachel Carter')).toBeLessThanOrEqual(5)
})

it('is an image named by the person, sized in pixels', () => {
  render(<Avatar name="Rachel Carter" size={40} />)
  const avatar = screen.getByRole('img', { name: 'Rachel Carter' })
  expect(avatar).toHaveTextContent('RC')
  expect(avatar).toHaveStyle({ width: '40px', height: '40px', fontSize: '15px' })
  expect(avatar).toHaveAttribute('data-fill', String(fillOf('Rachel Carter')))
})

it('has no fill when plain', () => {
  render(<Avatar name="Rachel Carter" plain />)
  const avatar = screen.getByRole('img')
  expect(avatar).toHaveClass('gx-avatar--plain')
  expect(avatar).not.toHaveAttribute('data-fill')
})

it('takes a soft ground of the palette with its own text color, never a gradient or white initials', () => {
  const fills = new Set<string>()
  for (const name of ['Maya Chen', 'Diego Ramirez', 'Aisha Khan', 'Rachel Carter', 'Sam Lee', 'Noor Ali', 'Ivy Park', 'Omar Diaz', 'Lena Wu', 'Theo Brandt']) {
    const { unmount } = render(<Avatar name={name} />)
    const avatar = screen.getByRole('img', { name })
    const ground = [...avatar.classList].find((c) => /^bg-(blue|violet|good|warn|pink)-soft$/.test(c))
    expect(ground, name).toBeDefined()
    expect(avatar).toHaveClass(`text-${ground!.slice('bg-'.length, -'-soft'.length)}`)
    expect(avatar).not.toHaveClass('text-white')
    fills.add(ground!)
    unmount()
  }
  expect(fills.size).toBeGreaterThan(2)
})
