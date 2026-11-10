import { Button, Popover, PopoverContent, PopoverTrigger } from '../../src'

export function OnAButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="soft">Open</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">14 students are Proficient in HSG.SRT.B.5.</div>
      </PopoverContent>
    </Popover>
  )
}
