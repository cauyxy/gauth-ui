import { render } from '@testing-library/react'
import { Meter } from './Meter'

const fill = (value: number) => render(<Meter value={value} />).container.querySelector('.gx-meter__fill')

it('fills to its value and stays between 0 and 100', () => {
  expect(fill(40)).toHaveStyle({ width: '40%' })
  expect(fill(140)).toHaveStyle({ width: '100%' })
  expect(fill(-5)).toHaveStyle({ width: '0%' })
})
