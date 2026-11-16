import { Button, Chip, Icon, IconBox, LevelLadder, LevelMark, StepProgress, StudentCard, StudentCardTitle } from '../../src'

export function Goal() {
  return (
    <div className="grid w-full max-w-[26rem] gap-4">
      <StudentCard tone="violet" className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <IconBox size={36} tone="violet" className="bg-white">
            <Icon name="goal" />
          </IconBox>
          <div className="min-w-0 flex-1">
            <StudentCardTitle>2 more questions today</StudentCardTitle>
            <p className="text-sm text-violet-deep">Then your 5-day streak goes on.</p>
          </div>
        </div>
        <StepProgress done={4} total={6} label="Today's goal" />
      </StudentCard>
      <StudentCard className="flex items-center gap-3">
        <IconBox size={36}>
          <Icon name="lesson" />
        </IconBox>
        <div className="min-w-0 flex-1">
          <StudentCardTitle>Special right triangles</StudentCardTitle>
          <p className="text-sm text-muted">Lesson · 10 min</p>
        </div>
        <Button size="xl">Start</Button>
      </StudentCard>
    </div>
  )
}

export function LevelReached() {
  return (
    <StudentCard level="proficient" className="flex w-full max-w-[26rem] flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-[44px] flex-none place-items-center rounded-full bg-white">
          <LevelMark level="proficient" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <StudentCardTitle>You reached Proficient</StudentCardTitle>
          <p className="text-sm text-mastered-ink">Pythagorean theorem</p>
        </div>
      </div>
      <div className="grid place-items-center rounded-2xl bg-white px-3 py-4">
        <LevelLadder level="proficient" />
      </div>
    </StudentCard>
  )
}

export function Celebration() {
  return (
    <StudentCard tone="pink" className="flex w-full max-w-[26rem] items-center gap-3">
      <IconBox size={44} tone="pink" className="rounded-full bg-white">
        <Icon name="trophy" />
      </IconBox>
      <div className="min-w-0 flex-1">
        <StudentCardTitle>Unit 4 finished</StudentCardTitle>
        <p className="text-sm text-ink-soft">You earned the Right Triangles badge.</p>
      </div>
      <Chip tone="pink" className="bg-white">
        New badge
      </Chip>
    </StudentCard>
  )
}
