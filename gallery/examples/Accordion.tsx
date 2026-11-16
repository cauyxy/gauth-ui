import { Accordion, AccordionItem } from '../../src'

export function UnitLessons() {
  return (
    <Accordion type="single" collapsible defaultValue="2" className="w-full max-w-[34rem]">
      <AccordionItem value="1" title="Lesson 1: Equivalent ratios" meta="Done">
        Tables of equivalent ratios, and using them to compare two ratios.
      </AccordionItem>
      <AccordionItem value="2" title="Lesson 2: Unit rates" meta="3 of 5 skills">
        Finding the rate for one unit, and using it to compare prices and speeds.
      </AccordionItem>
      <AccordionItem value="3" title="Lesson 3: Percent" meta="Opens Mon" disabled>
        Percent as a rate per 100.
      </AccordionItem>
    </Accordion>
  )
}

export function Questions() {
  return (
    <Accordion type="multiple" className="w-full max-w-[34rem]">
      <AccordionItem value="see" title="Who sees a student's answers?">
        The student and their teachers. Other students never do.
      </AccordionItem>
      <AccordionItem value="late" title="Can a student hand in late work?">
        Yes, until you close the assignment. Late work is marked late.
      </AccordionItem>
    </Accordion>
  )
}
