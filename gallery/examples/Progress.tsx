import { Progress } from '../../src'

export function KnownAndUnknown() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Progress value={33} label="Practice set">
        2 of 6
      </Progress>
      <Progress label="Building your set">Building</Progress>
    </div>
  )
}
