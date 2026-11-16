import { Button, Separator } from '../../src'

export function BetweenSections() {
  return (
    <div className="grid w-full max-w-[24rem] gap-3 text-sm">
      <span>14 students answered</span>
      <Separator />
      <span>3 students have not started</span>
    </div>
  )
}

export function InAToolbar() {
  return (
    <div className="flex h-(--gx-h-md) items-center gap-2">
      <Button variant="ghost">Assign</Button>
      <Button variant="ghost">Preview</Button>
      <Separator orientation="vertical" />
      <Button variant="ghost">Print</Button>
    </div>
  )
}
