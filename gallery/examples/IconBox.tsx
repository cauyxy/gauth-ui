import { Icon, IconBox } from '../../src'

export function Icons() {
  return (
    <>
      <IconBox>
        <Icon name="search" />
      </IconBox>
      <IconBox>
        <Icon name="users" />
      </IconBox>
      <IconBox>
        <Icon name="calendar" />
      </IconBox>
    </>
  )
}

const SUBJECTS = [
  { icon: 'subject-math', name: 'Algebra 1' },
  { icon: 'subject-geometry', name: 'Geometry' },
  { icon: 'subject-science', name: 'Biology' },
  { icon: 'subject-reading', name: 'English 9' },
] as const

export function Subjects() {
  return (
    <div className="grid w-full max-w-[22rem] gap-3">
      {SUBJECTS.map((s) => (
        <span key={s.name} className="flex items-center gap-3 text-sm font-control">
          <IconBox size={36}>
            <Icon name={s.icon} />
          </IconBox>
          {s.name}
        </span>
      ))}
    </div>
  )
}
