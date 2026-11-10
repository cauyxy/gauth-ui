import { LevelLadder } from '../../src'

export function TwoStudents() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <LevelLadder level="familiar" />
      <LevelLadder level="mastered" />
    </div>
  )
}
