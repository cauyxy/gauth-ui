import { render, screen } from '@testing-library/react'
import { Panel, PanelHeader } from './Panel'

it('is a section with a titled header and its actions', () => {
  render(
    <Panel aria-label="Needs support">
      <PanelHeader title="Needs support">
        <button type="button">Reteach</button>
      </PanelHeader>
    </Panel>,
  )
  expect(screen.getByRole('region', { name: 'Needs support' })).toHaveClass('gx-panel')
  expect(screen.getByRole('heading', { level: 2, name: 'Needs support' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Reteach' })).toBeInTheDocument()
})
