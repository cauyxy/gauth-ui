import { createElement } from 'react'
import { ICONS } from './icons'
import type { Props } from './props'

export type IconName = keyof typeof ICONS
export type IconProps = Props<'svg', { name: IconName; size?: number; strokeWidth?: number }>

/*
 * The icons are Lucide's, drawn on a 24 grid. The rule is a 1.8px stroke at 20px, so the stroke is 2.16 on that grid.
 * `scripts/icons.ts` lists the icons and copies their drawings.
 */
const GRID = 24
const STROKE_AT_20 = 1.8

/**
 * A line icon: 20px, 1.8px stroke, round ends, currentColor, never filled. `strokeWidth` is the stroke at 20px.
 * It is decoration: the control that holds it carries the accessible name.
 */
export function Icon({ name, size = 20, strokeWidth = STROKE_AT_20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${GRID} ${GRID}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={(strokeWidth * GRID) / 20}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {ICONS[name].map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  )
}
