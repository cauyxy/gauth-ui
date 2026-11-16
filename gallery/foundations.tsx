/*
 * What the system has besides components, drawn with itself: the type scale and the movements. The docs site and the
 * Design System artifact show them. Every name, value and note is read from tokens.css. Not part of the package.
 */
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button, Chip } from '../src'
import css from '../src/styles/tokens.css?raw'

type Token = { name: string; value: string; usage: string }

/** The tokens whose name starts with `family-`, each with the note on its line. */
const tokens = (family: string): Token[] =>
  [...css.matchAll(new RegExp(`^[ \\t]*--gx-(${family}-[\\w-]+):[ \\t]*(.+?);(?:[ \\t]*/\\*[ \\t]*(.*?)[ \\t]*\\*/)?$`, 'gm'))].map((m) => ({
    name: m[1]!,
    value: m[2]!,
    usage: m[3] ?? '',
  }))

function Row({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-3 last:border-b-0">
      <span className="w-40 flex-none font-mono text-xs text-muted">{name}</span>
      <span className="min-w-0 flex-1 basis-64 text-ink">{children}</span>
      <span className="w-full text-xs leading-body text-muted md:w-64 md:flex-none">{note}</span>
    </div>
  )
}

/** Every type size and weight, each as a line set in itself. */
export function TypeScale() {
  return (
    <div className="w-full">
      {tokens('text')
        .toReversed()
        .map((token) => (
          <Row key={token.name} name={token.name} note={token.usage}>
            <span className="block truncate" style={{ fontSize: `var(--gx-${token.name})` }}>
              Find the missing side
            </span>
          </Row>
        ))}
      {tokens('font-weight').map((token) => (
        <Row key={token.name} name={token.name} note={`${token.value}. ${token.usage}`}>
          <span style={{ fontWeight: `var(--gx-${token.name})` }}>Needs support</span>
        </Row>
      ))}
      {/* The faces that are not the face of the page (they have a note on their line), each set in itself. */}
      {tokens('font')
        .filter((token) => !token.name.startsWith('font-weight-') && token.usage)
        .map((token) => (
          <Row key={token.name} name={token.name} note={token.usage}>
            <span style={{ fontFamily: `var(--gx-${token.name})` }}>I had no regular teacher. 6² + 8² = 100</span>
          </Row>
        ))}
    </div>
  )
}

/** The line heights and letter spacings, each on the kind of text it is for. */
export function TypeSpacing() {
  const SAMPLE: Record<string, [text: string, style: CSSProperties]> = {
    'leading-figure': ['86%', { fontSize: 'var(--gx-text-3xl)', fontWeight: 'var(--gx-font-weight-strong)' }],
    'leading-title': ['What Period 3 needs next: squaring before adding', { fontSize: 'var(--gx-text-2xl)', fontWeight: 'var(--gx-font-weight-strong)' }],
    'leading-heading': ['Exit ticket: similar triangles and scale factors, with a worked answer for each one', { fontSize: 'var(--gx-text-lg)', fontWeight: 'var(--gx-font-weight-title)' }], // oxfmt-ignore
    'leading-body': ['In a right triangle, the two shorter sides are the legs and the side across from the right angle is the hypotenuse.', {}],
    'tracking-display': ['Geometry, Period 3', { fontSize: 'var(--gx-text-2xl)', fontWeight: 'var(--gx-font-weight-strong)' }],
    'tracking-title': ['Pythagorean theorem', { fontSize: 'var(--gx-text-lg)', fontWeight: 'var(--gx-font-weight-title)' }],
    'tracking-label': ['STUDENTS', { fontSize: 'var(--gx-text-2xs)', fontWeight: 'var(--gx-font-weight-control)' }],
  }
  return (
    <div className="w-full">
      {[...tokens('leading'), ...tokens('tracking')].map((token) => {
        const [text, style] = SAMPLE[token.name] ?? ['Find the missing side', {}]
        const spacing = token.name.startsWith('leading') ? { lineHeight: `var(--gx-${token.name})` } : { letterSpacing: `var(--gx-${token.name})` }
        return (
          <Row key={token.name} name={token.name} note={`${token.value}. ${token.usage}`}>
            <span className="block max-w-[20rem]" style={{ ...style, ...spacing }}>
              {text}
            </span>
          </Row>
        )
      })}
    </div>
  )
}

/** What plays one movement: a tile for most, and the shape each of the three loops belongs to. */
function Stage({ token, run, onEnd }: { token: Token; run: number; onEnd: () => void }) {
  const animation = `var(--gx-${token.name})`
  if (token.name === 'animate-spin') return <span className="size-6 rounded-full border-2 border-rule border-t-ink" style={{ animation }} />
  if (token.name === 'animate-sweep')
    return (
      <span className="relative h-[6px] w-full overflow-hidden rounded-full bg-track">
        <span className="absolute inset-y-0 w-[33%] rounded-full bg-ink" style={{ animation }} />
      </span>
    )
  if (token.name === 'animate-pulse') return <span className="h-4 w-full rounded-md bg-track" style={{ animation }} />
  /* A new key starts the movement again from its first frame. */
  return <span key={run} className="size-10 rounded-lg bg-white shadow-card" style={run ? { animation } : undefined} onAnimationEnd={onEnd} />
}

/** Every named movement, played on a tile, then every duration and easing. The three that loop run by themselves. */
export function Motion() {
  const [runs, setRuns] = useState<Record<string, number>>({})
  return (
    <div className="grid w-full gap-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
        {tokens('animate').map((token) => {
          const loops = token.value.includes('infinite')
          const name = token.name.slice('animate-'.length)
          return (
            <div key={token.name} className="flex flex-col gap-3 rounded-2xl p-3 shadow-edge">
              <div className="grid h-20 place-items-center overflow-hidden rounded-xl bg-surface px-4">
                <Stage token={token} run={runs[name] ?? 0} onEnd={() => setRuns((all) => ({ ...all, [name]: 0 }))} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-ink">{name}</span>
                {loops ? (
                  <Chip>Loops</Chip>
                ) : (
                  <Button size="sm" variant="soft" onClick={() => setRuns((all) => ({ ...all, [name]: (all[name] ?? 0) + 1 }))}>
                    Play
                  </Button>
                )}
              </div>
              <p className="text-xs leading-body text-pretty text-muted">{token.usage}</p>
            </div>
          )
        })}
      </div>
      <div className="w-full">
        {[...tokens('dur'), ...tokens('delay'), ...tokens('ease')].map((token) => (
          <Row key={token.name} name={token.name} note={token.usage}>
            <span className="font-mono text-xs">{token.value.replace(/calc\((\d+ms) \* var\(--gx-ms\)\)/, '$1')}</span>
          </Row>
        ))}
      </div>
    </div>
  )
}
