import { cx } from '../core/cx'

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

/** The number of `--gx-avatar-N` fills in tokens.css. */
const FILLS = 6

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
      className={cx('gx-avatar', plain && 'gx-avatar--plain', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initialsOf(name)}
    </span>
  )
}
