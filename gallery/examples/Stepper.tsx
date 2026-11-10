import { Stepper } from '../../src'

export function FourSteps() {
  return (
    <div className="w-full max-w-[34rem]">
      <Stepper steps={['Standard', 'Problems', 'Review', 'Assign']} current={1} />
    </div>
  )
}
