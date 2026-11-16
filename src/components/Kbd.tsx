import type { ReactNode } from 'react'
import { cn } from '../core/cn'

/** One key of the keyboard, in running text or a tooltip: "Press Enter to send". Several keys are several `Kbd`s. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'gx-kbd inline-grid h-[1.25rem] min-w-[1.25rem] place-items-center rounded-md bg-surface px-1 align-baseline font-mono text-2xs text-muted shadow-edge-strong',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
