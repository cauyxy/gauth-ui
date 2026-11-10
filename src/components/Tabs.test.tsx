import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const Example = (props: ComponentProps<typeof Tabs>) => (
  <Tabs {...props}>
    <TabList aria-label="Geometry · Period 3">
      <Tab value="students">Students</Tab>
      <Tab value="skills">Skills</Tab>
      <Tab value="practice">Practice</Tab>
    </TabList>
    <TabPanel value="students">28 students</TabPanel>
    <TabPanel value="skills">HSG.SRT.B.5</TabPanel>
    <TabPanel value="practice">Form B</TabPanel>
  </Tabs>
)

it('shows the picked tab and its panel', () => {
  render(<Example defaultValue="students" className="mine" />)
  expect(screen.getByRole('tablist', { name: 'Geometry · Period 3' })).toHaveClass('gx-tabs__list')
  expect(screen.getByRole('tablist').parentElement).toHaveClass('gx-tabs', 'mine')
  expect(screen.getByRole('tab', { name: 'Students' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('tab', { name: 'Skills' })).toHaveAttribute('aria-selected', 'false')
  expect(screen.getByRole('tabpanel', { name: 'Students' })).toHaveTextContent('28 students')
})

it('switches on a click', async () => {
  render(<Example defaultValue="students" />)
  await userEvent.click(screen.getByRole('tab', { name: 'Skills' }))
  expect(screen.getByRole('tab', { name: 'Skills' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('tabpanel', { name: 'Skills' })).toHaveTextContent('HSG.SRT.B.5')
  expect(screen.queryByText('28 students')).not.toBeInTheDocument()
})

it('is one Tab stop, and the arrow keys move the pick', async () => {
  render(<Example defaultValue="students" />)
  await userEvent.tab()
  expect(screen.getByRole('tab', { name: 'Students' })).toHaveFocus()
  await userEvent.keyboard('{ArrowRight}')
  expect(screen.getByRole('tab', { name: 'Skills' })).toHaveFocus()
  expect(screen.getByRole('tabpanel')).toHaveTextContent('HSG.SRT.B.5')
  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
  expect(screen.getByRole('tab', { name: 'Practice' })).toHaveAttribute('aria-selected', 'true')
  await userEvent.tab()
  expect(screen.getByRole('tabpanel', { name: 'Practice' })).toHaveFocus()
})

it('reports the new value and stays on the value it is given', async () => {
  const onChange = vi.fn()
  render(<Example value="students" onChange={onChange} />)
  await userEvent.click(screen.getByRole('tab', { name: 'Practice' }))
  expect(onChange).toHaveBeenLastCalledWith('practice')
  expect(screen.getByRole('tab', { name: 'Students' })).toHaveAttribute('aria-selected', 'true')
})
