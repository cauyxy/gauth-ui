import { Button, Table, TableCell, TableHead, TableRow } from '../../src'

const ROSTER = [
  { student: 'Devon Wright', level: 'Attempted', last: 'Fri, Nov 6', action: 'Reteach' },
  { student: 'Maya Chen', level: 'Attempted', last: 'Fri, Nov 6', action: 'Reteach' },
  { student: 'Diego Ramirez', level: 'Familiar', last: 'Mon, Nov 9', action: 'Review' },
  { student: 'Aiko Tanaka', level: 'Proficient', last: 'Mon, Nov 9', action: 'Review' },
] as const

export function Roster() {
  return (
    <div className="w-full">
      <Table label="Needs support" columns="minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) 5.5rem">
        <TableHead>
          <TableCell head>Student</TableCell>
          <TableCell head>Level</TableCell>
          <TableCell head>Last practice</TableCell>
          <TableCell head />
        </TableHead>
        {ROSTER.map((row) => (
          <TableRow key={row.student}>
            <TableCell>{row.student}</TableCell>
            <TableCell>
              <span className="text-muted">{row.level}</span>
            </TableCell>
            <TableCell>
              <span className="text-muted">{row.last}</span>
            </TableCell>
            <TableCell align="end">
              <Button variant="outline" size="sm">
                {row.action}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
