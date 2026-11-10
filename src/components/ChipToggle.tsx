import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

/*
 * On, it stays white: the ink ring is the shape signal, the ink text is the color one.
 * An icon's strokes do not fill its box, so an icon at the start sits closer to the edge.
 */
const chipToggle = cva(
  'gx-chip-toggle inline-flex flex-none items-center gap-1.5 rounded-lg bg-white text-sm font-control whitespace-nowrap text-ink-soft shadow-edge-strong cursor-pointer outline-0 transition-[color,background-color,box-shadow] duration-(--gx-dur-fast) ease-standard enabled:hover:bg-surface focus-visible:focus-ring focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50 aria-pressed:text-ink aria-pressed:shadow-outline [&>svg]:size-[16px] [&>svg]:flex-none [&>svg:first-child]:-ms-0.5',
  {
    variants: {
      size: {
        sm: 'gx-chip-toggle--sm h-(--gx-h-sm) px-2.5',
        md: 'gx-chip-toggle--md h-(--gx-h-md) px-3',
      },
    },
  },
)

/**
 * A chip to press: a filter, a skill to pick. On, it stays white and gets the ink ring.
 * A set of them goes in the product's own `role="group"` with a name.
 */
export function ChipToggle({
  pressed,
  onChange,
  size = 'sm',
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'onChange' | 'onClick' | 'aria-pressed'> & {
  pressed: boolean
  onChange: (pressed: boolean) => void
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      {...props}
      onClick={() => onChange(!pressed)}
      className={cn(chipToggle({ size }), className)}
    />
  )
}
