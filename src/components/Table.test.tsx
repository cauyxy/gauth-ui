import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, TableCell, TableHead, TableRow } from './Table'

const COLUMNS = 'minmax(0, 1.4fr) minmax(0, 1fr) 5.5rem'

const roster = (onClick?: () => void) => (
  <Table label="Needs support" columns={COLUMNS} className="mine">
    <TableHead>
      <TableCell head>Student</TableCell>
      <TableCell head>Level</TableCell>
      <TableCell head />
    </TableHead>
    <TableRow onClick={onClick} data-student="devon">
      <TableCell>Devon Wright</TableCell>
      <TableCell>Attempted</TableCell>
      <TableCell align="end">
        <button type="button">Reteach</button>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Aiko Tanaka</TableCell>
      <TableCell>Proficient</TableCell>
      <TableCell align="end">
        <button type="button">Review</button>
      </TableCell>
    </TableRow>
  </Table>
)

it('is a named table that gives its columns to every row', () => {
  render(roster())
  const table = screen.getByRole('table', { name: 'Needs support' })
  expect(table).toHaveClass('gx-table', 'mine')
  expect(table.style.getPropertyValue('--gx-table-columns')).toBe(COLUMNS)
})

it('has a row of column heads and a row of cells for each student', () => {
  render(roster())
  const rows = screen.getAllByRole('row')
  expect(rows).toHaveLength(3)
  expect(within(rows[0]!).getAllByRole('columnheader')).toHaveLength(3)
  expect(screen.getByRole('columnheader', { name: 'Student' })).toBeInTheDocument()
  const cells = within(rows[1]!).getAllByRole('cell')
  expect(cells.map((cell) => cell.textContent)).toEqual(['Devon Wright', 'Attempted', 'Reteach'])
  expect(cells[2]).toHaveClass('gx-table__cell--end')
  expect(cells[0]).not.toHaveClass('gx-table__cell--end')
})

it('passes native props to a row', async () => {
  const onClick = vi.fn()
  render(roster(onClick))
  const row = screen.getAllByRole('row')[1]!
  expect(row).toHaveAttribute('data-student', 'devon')
  await userEvent.click(within(row).getByText('Devon Wright'))
  expect(onClick).toHaveBeenCalledTimes(1)
})
