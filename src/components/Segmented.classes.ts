import { cn } from '../core/cn'

/** The track and option classes, for a segmented control whose options are links. */
export const segmentedTrackClass = (className?: string) => cn('gx-segmented flex gap-0.5 rounded-xl bg-track p-1', className)
export const segmentedOptionClass = (on: boolean, className?: string) =>
  cn(
    'gx-segmented__option grid h-[1.75rem] min-w-0 place-items-center truncate rounded-lg px-3 text-sm font-control text-muted no-underline cursor-pointer outline-0 hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-1 aria-checked:bg-white aria-checked:text-ink aria-checked:shadow-raise',
    on && 'gx-segmented__option--on bg-white text-ink shadow-raise',
    className,
  )
