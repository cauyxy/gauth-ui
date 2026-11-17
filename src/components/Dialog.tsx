'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { ModalFrame } from './Dialog.parts'

export type DialogActionsProps = ComponentProps<'div'>
export type DialogContentProps = Props<typeof DialogPrimitive.Content, { title: string; description?: ReactNode }>

/** A question or a short task that takes over the page until the person answers it. Focus stays inside; Escape closes it. */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

/** The row of answers at the end of a dialog: right-aligned, the main answer last. */
export function DialogActions({ className, ...props }: DialogActionsProps) {
  return <div className={cn('gx-dialog__actions flex flex-wrap justify-end gap-2', className)} {...props} />
}

/** The panel, on its scrim. `title` is its accessible name; `children` are the body, then `DialogActions`. */
export function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <ModalFrame
      root="gx-dialog"
      /* Centered by its margins, not by a transform: the pop animation owns the transform. */
      className={cn(
        'gx-dialog inset-0 m-auto h-fit max-h-[calc(100dvh-2*var(--gx-space-4))] w-[min(480px,calc(100vw-2*var(--gx-space-4)))] rounded-3xl data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out',
        className,
      )}
      {...props}
    />
  )
}
