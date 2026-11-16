import { useState } from 'react'
import { Slider } from '../../src'

export function DailyGoal() {
  const [goal, setGoal] = useState(10)
  return (
    <div className="grid w-full max-w-[24rem] gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-control">Daily goal</span>
        <span className="text-muted">{goal} questions</span>
      </div>
      <Slider label="Daily goal" min={5} max={30} step={5} value={goal} onChange={setGoal} formatValue={(n) => `${n} questions`} />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-[24rem]">
      <Slider label="Share of review questions" value={40} onChange={() => {}} disabled formatValue={(n) => `${n}%`} />
    </div>
  )
}
