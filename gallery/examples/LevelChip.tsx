import { LevelChip, LEVELS } from '../../src'

export function Levels() {
  return (
    <>
      {LEVELS.toReversed().map((level) => (
        <LevelChip key={level} level={level} />
      ))}
    </>
  )
}
