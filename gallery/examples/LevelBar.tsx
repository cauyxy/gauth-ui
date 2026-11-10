import { LevelBar } from '../../src'

export function ClassAndEmpty() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <LevelBar label="Geometry · Period 3" counts={{ mastered: 9, proficient: 7, familiar: 6, attempted: 4, not_started: 2 }} />
      <LevelBar label="Geometry · Period 5" counts={{}} />
    </div>
  )
}
