import { Generating } from '../../src'

export function ThreeSteps() {
  return (
    <div className="w-full max-w-[34rem]">
      <Generating
        label="Building Form B"
        steps={[
          { label: 'Read the class’s readiness results', state: 'done' },
          { label: 'Writing Form B for HSG.SRT.B.5', state: 'current' },
          { label: 'Check each answer', state: 'upcoming' },
        ]}
      />
    </div>
  )
}
