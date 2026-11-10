import { useState } from 'react'
import { Breadcrumbs } from '../src/components/Breadcrumbs'
import { Button } from '../src/components/Button'
import { PageTitle } from '../src/components/PageTitle'
import { Stepper } from '../src/components/Stepper'
import { Table, TableCell, TableHead, TableRow } from '../src/components/Table'
import { Tab, TabList, TabPanel, Tabs } from '../src/components/Tabs'
import { Composer } from '../src/learning/Composer'
import { Generating } from '../src/learning/Generating'
import { Section } from './section'

const ROSTER = [
  { student: 'Devon Wright', level: 'Attempted', last: 'Fri, Nov 6', action: 'Reteach' },
  { student: 'Maya Chen', level: 'Attempted', last: 'Fri, Nov 6', action: 'Reteach' },
  { student: 'Diego Ramirez', level: 'Familiar', last: 'Mon, Nov 9', action: 'Review' },
  { student: 'Aiko Tanaka', level: 'Proficient', last: 'Mon, Nov 9', action: 'Review' },
] as const

const muted = { color: 'var(--gx-color-muted)' }
/* A page title and a table take the page's width. */
const WIDE = { maxWidth: 'none' }

export default function Structure() {
  const [tab, setTab] = useState('students')
  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState('Why do the triangles have to be similar?')
  return (
    <>
      <Section title="Breadcrumbs">
        <div className="g-row">
          <Breadcrumbs>
            <a href="#classes">Classes</a>
            <a href="#geometry-3">Geometry · Period 3</a>
            Needs support
          </Breadcrumbs>
        </div>
      </Section>
      <Section title="PageTitle">
        <div className="g-col" style={WIDE}>
          <PageTitle
            title="Needs support"
            crumbs={
              <Breadcrumbs>
                <a href="#classes">Classes</a>
                <a href="#geometry-3">Geometry · Period 3</a>
              </Breadcrumbs>
            }
          >
            <Button variant="outline">Print</Button>
            <Button>Send practice</Button>
          </PageTitle>
        </div>
      </Section>
      <Section title="Tabs">
        <div className="g-col">
          <Tabs value={tab} onChange={setTab}>
            <TabList aria-label="Geometry · Period 3">
              <Tab value="students">Students</Tab>
              <Tab value="skills">Skills</Tab>
              <Tab value="practice">Practice</Tab>
            </TabList>
            <TabPanel value="students" style={{ paddingTop: 'var(--gx-space-4)' }}>
              28 students, 6 need support on HSG.SRT.B.5
            </TabPanel>
            <TabPanel value="skills" style={{ paddingTop: 'var(--gx-space-4)' }}>
              3 skills this week: HSG.SRT.B.5, HSG.SRT.C.8, HSG.CO.C.10
            </TabPanel>
            <TabPanel value="practice" style={{ paddingTop: 'var(--gx-space-4)' }}>
              Similar triangles, Form B, due Thu
            </TabPanel>
          </Tabs>
        </div>
      </Section>
      <Section title="Table">
        <div className="g-col" style={WIDE}>
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
                  <span style={muted}>{row.level}</span>
                </TableCell>
                <TableCell>
                  <span style={muted}>{row.last}</span>
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
      </Section>
      <Section title="Stepper">
        <div className="g-col">
          <Stepper steps={['Standard', 'Problems', 'Review', 'Assign']} current={1} />
        </div>
      </Section>
      <Section title="Composer">
        <div className="g-col">
          <span style={muted}>{asked}</span>
          <Composer
            label="Ask Gauth AI"
            placeholder="Ask about this step"
            value={question}
            onChange={setQuestion}
            onSend={(text) => {
              setAsked(text)
              setQuestion('')
            }}
          />
        </div>
      </Section>
      <Section title="Generating">
        <div className="g-col">
          <Generating
            label="Building Form B"
            steps={[
              { label: 'Read the class’s readiness results', state: 'done' },
              { label: 'Writing Form B for HSG.SRT.B.5', state: 'current' },
              { label: 'Check each answer', state: 'upcoming' },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
