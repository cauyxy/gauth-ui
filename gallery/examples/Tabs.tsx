import { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from '../../src'

export function ClassPage() {
  const [tab, setTab] = useState('students')
  return (
    <div className="w-full max-w-[34rem]">
      <Tabs value={tab} onChange={setTab}>
        <TabList aria-label="Geometry · Period 3">
          <Tab value="students">Students</Tab>
          <Tab value="skills">Skills</Tab>
          <Tab value="practice">Practice</Tab>
        </TabList>
        <TabPanel value="students" className="pt-4">
          28 students, 6 need support on HSG.SRT.B.5
        </TabPanel>
        <TabPanel value="skills" className="pt-4">
          3 skills this week: HSG.SRT.B.5, HSG.SRT.C.8, HSG.CO.C.10
        </TabPanel>
        <TabPanel value="practice" className="pt-4">
          Similar triangles, Form B, due Thu
        </TabPanel>
      </Tabs>
    </div>
  )
}
