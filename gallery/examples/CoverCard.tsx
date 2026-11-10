import { Chip, CoverCard } from '../../src'

/* A cover drawn with tokens: a soft ground and a sheet of paper. A product puts its own picture here. */
function Cover({ tone }: { tone: 'violet' | 'blue' | 'good' }) {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ width: '100%', height: '100%', background: `var(--gx-color-${tone}-soft)` }}>
      <rect x="46" y="20" width="68" height="96" rx="6" style={{ fill: 'var(--gx-color-white)' }} />
      <rect x="56" y="33" width="28" height="5" rx="2.5" style={{ fill: `var(--gx-color-${tone})` }} />
      {[48, 58, 68, 78, 88].map((y, i) => (
        <rect key={y} x="56" y={y} width={i % 2 ? 36 : 48} height="3" rx="1.5" style={{ fill: 'var(--gx-color-rule)' }} />
      ))}
    </svg>
  )
}

export function Cards() {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
      <CoverCard href="#CoverCard" cover={<Cover tone="violet" />} title="Worksheet" description="Practice problems on one skill, with an answer key." />
      <CoverCard
        cover={<Cover tone="blue" />}
        title="Exit ticket: similar triangles and scale factors"
        description="5 questions on similar triangles. Made after Thursday's lesson on scale factors, with a worked answer for each one."
        meta={
          <>
            <Chip tone="blue">HSG.SRT.B.5</Chip>
            Mon, Nov 9
          </>
        }
      />
      <CoverCard cover={<Cover tone="good" />} title="Pythagorean theorem: guided notes" description="Notes for one class period." meta={<Chip>Grade 8</Chip>} />
    </div>
  )
}
