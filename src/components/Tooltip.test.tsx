import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

it('shows its note when the trigger takes focus', async () => {
  render(
    <Tooltip>
      <TooltipTrigger>62%</TooltipTrigger>
      <TooltipContent>Share of the class at Proficient</TooltipContent>
    </Tooltip>,
  )
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.tab()
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Share of the class at Proficient')
  expect(document.querySelector('.gx-tooltip')).toBeInTheDocument()
})
