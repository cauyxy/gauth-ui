import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>
export type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content>

/** A short note on hover or focus. Each one carries its own provider, so pages need no wrapper. */
export function Tooltip({ delayDuration = 150, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  )
}

export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({ className, sideOffset = 6, children, ...props }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'gx-tooltip z-(--gx-z-pop) max-w-[18rem] rounded-lg bg-ink px-3 py-2 text-xs leading-body text-white shadow-pop animate-tip-in data-[state=closed]:animate-fade-out',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
