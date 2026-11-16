import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '../../src'

export function StudentDetails() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="soft">Open Maya Johnson</Button>
      </SheetTrigger>
      <SheetContent title="Maya Johnson" description="Geometry · Period 3">
        <div className="grid gap-2 text-sm">
          <span>Proficient in 7 of 12 skills</span>
          <span className="text-muted">Last practice: Fri, Nov 13</span>
        </div>
        <div className="mt-auto flex gap-2">
          <Button>Send practice</Button>
          <SheetClose asChild>
            <Button variant="soft">Done</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function FromTheStart() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent side="start" title="Filters">
        <span className="text-sm text-muted">Pick the students to show.</span>
      </SheetContent>
    </Sheet>
  )
}
