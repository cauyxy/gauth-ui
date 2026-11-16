'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

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
export function DialogContent({ title, description, className, children, ...props }: DialogContentProps) {
  const { messages } = useLocale()
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="gx-dialog__scrim fixed inset-0 z-(--gx-z-overlay) bg-ink/40 animate-fade-in data-[state=closed]:animate-fade-out" />
      {/* Centered by its margins, not by a transform: the pop animation owns the transform. */}
      <DialogPrimitive.Content
        className={cn(
          'gx-dialog fixed inset-0 z-(--gx-z-overlay) m-auto flex h-fit max-h-[calc(100dvh-2*var(--gx-space-4))] w-[min(480px,calc(100vw-2*var(--gx-space-4)))] flex-col gap-3.5 overflow-y-auto rounded-3xl bg-white p-6 text-ink shadow-pop outline-none data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out',
          className,
        )}
        {...props}
      >
        {/* The title leaves room for the close button. */}
        <DialogPrimitive.Title className="gx-dialog__title pe-8 text-xl leading-heading font-strong tracking-title text-balance">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="gx-dialog__description text-sm leading-body text-pretty text-muted">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        {children}
        {/* Last in the markup, so focus goes to the body's first control when the dialog opens. */}
        <DialogPrimitive.Close
          className="gx-dialog__close absolute top-5 right-5 grid size-(--gx-h-sm) cursor-pointer place-items-center rounded-lg text-muted outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-2"
          aria-label={messages.close}
        >
          <Icon name="close" size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
