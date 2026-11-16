import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type IconButtonVariant = 'ghost' | 'soft' | 'outline' | 'ink'
export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type IconButtonProps = Props<
  'button',
  { label: string; variant?: IconButtonVariant; size?: IconButtonSize; pressed?: boolean },
  'aria-label' | 'aria-pressed'
>

/*
 * A toggle that is on has an ink icon on the soft ground, whatever its variant: the ground is the shape signal, the ink is the color one.
 * The pointer on a button that is not disabled wins over that, so the soft one says it again for the pressed state.
 */
const iconButton = cva(
  'gx-icon-btn inline-grid flex-none place-items-center cursor-pointer outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50 aria-pressed:bg-surface aria-pressed:text-ink',
  {
    variants: {
      variant: {
        ghost: 'gx-icon-btn--ghost text-muted enabled:hover:bg-surface enabled:hover:text-ink',
        soft: 'gx-icon-btn--soft bg-surface text-ink enabled:hover:bg-track aria-pressed:enabled:hover:bg-track',
        outline: 'gx-icon-btn--outline text-ink shadow-edge-strong enabled:hover:bg-surface enabled:hover:text-ink',
        ink: 'gx-icon-btn--ink bg-ink text-white',
      },
      /* The four control heights, square. The icon grows with the button. */
      size: {
        sm: 'gx-icon-btn--sm size-(--gx-h-sm) rounded-lg [&>svg]:size-[16px]',
        md: 'gx-icon-btn--md size-(--gx-h-md) rounded-lg [&>svg]:size-[18px]',
        lg: 'gx-icon-btn--lg size-(--gx-h-lg) rounded-lg',
        xl: 'gx-icon-btn--xl size-(--gx-h-xl) rounded-xl',
      },
    },
  },
)

/**
 * A button that shows only an icon. `label` is its name for a screen reader, so it is required.
 * `pressed` makes it a toggle (bold in a toolbar, a vote under a reply): leave it out for a plain action.
 */
export function IconButton({ label, variant = 'ghost', size = 'md', pressed, type = 'button', className, ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} aria-pressed={pressed} className={cn(iconButton({ variant, size }), className)} {...props} />
}
