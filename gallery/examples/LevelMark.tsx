import { LEVELS, LevelMark } from '../../src'

export function Levels() {
  return (
    <>
      {LEVELS.toReversed().map((level) => (
        <LevelMark key={level} level={level} label />
      ))}
      <LevelMark level="mastered" size={20} label />
    </>
  )
}
