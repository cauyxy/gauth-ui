import { cn } from '../core/cn'

/** Titles don't count toward initials: "Ms. Carter" is C, "Rachel Carter" is RC. */
const TITLES = new Set(['mr', 'mrs', 'ms', 'mx', 'dr'])

export const initialsOf = (name: string) => {
  const parts = name.split(/\s+/).filter((p) => p && !TITLES.has(p.replace(/\.$/, '').toLowerCase()))
  const picked = parts.length > 2 ? [parts[0], parts[parts.length - 1]] : parts
  return picked
    .map((p) => p![0])
    .join('')
    .toUpperCase()
}

/** The avatar fills in tokens.css, one class for each. */
const FILL_CLASSES = [
  'bg-(image:--gx-avatar-1)',
  'bg-(image:--gx-avatar-2)',
  'bg-(image:--gx-avatar-3)',
  'bg-(image:--gx-avatar-4)',
  'bg-(image:--gx-avatar-5)',
  'bg-(image:--gx-avatar-6)',
]
const FILLS = FILL_CLASSES.length

/** Which fill a name takes (1 to 6): the same one for a person everywhere. */
export const fillOf = (name: string) => {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 1_000_003
  return (h % FILLS) + 1
}

/** Initials on a soft gradient. `size` is in pixels. `plain` draws them grey on grey. */
export function Avatar({ name, size = 30, plain, className }: { name: string; size?: number; plain?: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      data-fill={plain ? undefined : fillOf(name)}
      className={cn(
        'gx-avatar grid flex-none place-items-center rounded-full select-none',
        plain
          ? 'gx-avatar--plain bg-surface font-strong tracking-normal text-ink-soft'
          : ['font-title tracking-label text-white shadow-(--gx-avatar-edge)', FILL_CLASSES[fillOf(name) - 1]],
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initialsOf(name)}
    </span>
  )
}
