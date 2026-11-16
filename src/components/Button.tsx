import { cva } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

export type ButtonVariant = 'ink' | 'soft' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize; asChild?: boolean }

/* An icon's strokes do not fill its box, so an icon at an end sits 2px closer to the edge: the space the eye sees is then equal on both sides. */
const button = cva(
  'gx-btn inline-flex items-center justify-center gap-2 font-control whitespace-nowrap no-underline cursor-pointer outline-0 transition-colors duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&>svg:first-child]:-ms-0.5 [&>svg:last-child]:-me-0.5',
  {
    variants: {
      variant: {
        ink: 'gx-btn--ink bg-ink text-white hover:bg-black',
        soft: 'gx-btn--soft bg-surface text-ink hover:bg-track',
        outline: 'gx-btn--outline bg-white text-ink shadow-edge-strong hover:bg-surface',
        ghost: 'gx-btn--ghost text-ink hover:bg-surface',
        link: 'gx-btn--link text-muted hover:text-ink',
      },
      size: {
        sm: 'gx-btn--sm h-(--gx-h-sm) rounded-lg px-3 text-sm',
        md: 'gx-btn--md h-(--gx-h-md) rounded-lg px-3.5 text-sm',
        lg: 'gx-btn--lg h-(--gx-h-lg) rounded-xl px-4 text-sm',
        xl: 'gx-btn--xl h-(--gx-h-xl) rounded-xl px-5 text-base',
      },
    },
  },
)

/** The button look as a class string, for a link or another element that must look like a button. */
export const buttonClass = ({ variant = 'ink', size = 'md' }: { variant?: ButtonVariant; size?: ButtonSize } = {}, className?: string) =>
  cn(button({ variant, size }), className)

/** The one way to act on a row, card or page. `asChild` puts the look on the child element (a link). */
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const classes = buttonClass({ variant, size }, className)
  if (asChild) return <Slot.Root className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
