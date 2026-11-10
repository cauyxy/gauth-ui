import { StepProgress } from '../../src'

export function PracticeSet() {
  return (
    <div className="w-full max-w-[34rem]">
      <StepProgress done={2} total={6} label="Right triangles practice set" />
    </div>
  )
}
