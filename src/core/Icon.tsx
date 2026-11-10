import type { ComponentProps } from 'react'

/* The few line icons the components draw themselves. 20×20, 1.8px stroke, currentColor, never filled. */
const PATHS = {
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  'chevron-down': 'M5 7.5l5 5 5-5',
  'chevron-right': 'M7.5 5l5 5-5 5',
  'chevron-left': 'M12.5 5l-5 5 5 5',
  close: 'M5 5l10 10M15 5L5 15',
  search: 'M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM17 17l-3.6-3.6',
  'arrow-up': 'M10 16V4M4.5 9.5L10 4l5.5 5.5',
} as const

export type IconName = keyof typeof PATHS

/** A line icon. It is decoration: the control that holds it carries the accessible name. */
export function Icon({ name, size = 20, ...props }: { name: IconName; size?: number } & Omit<ComponentProps<'svg'>, 'name'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
