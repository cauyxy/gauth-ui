import { Meter } from '../../src'

export function Values() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Meter value={62} />
      <Meter value={18} />
    </div>
  )
}
