'use client'

/*
 * What Dialog and Sheet share: the scrim, and on the panel its title, its description and the close button. Each gives
 * its panel's place, size, corners and movement. Not exported from the package.
 */
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

type ModalFrameProps = Props<
  typeof DialogPrimitive.Content,
  {
    /** The gx- name of the panel: `gx-dialog`, `gx-sheet`. Its parts are named from it. */
    root: string
    title: string
    description?: ReactNode
  }
>

/** A panel above the page, on its scrim. Focus stays inside; Escape closes it. `className` places it. */
export function ModalFrame({ root, title, description, className, children, ...props }: ModalFrameProps) {
  const { messages } = useLocale()
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={`${root}__scrim fixed inset-0 z-(--gx-z-overlay) bg-ink/40 animate-fade-in data-[state=closed]:animate-fade-out`} />
      <DialogPrimitive.Content
        className={cn('fixed z-(--gx-z-overlay) flex flex-col gap-3.5 overflow-y-auto bg-white p-6 text-ink shadow-pop outline-none', className)}
        {...props}
      >
        {/* The title leaves room for the close button. */}
        <DialogPrimitive.Title className={`${root}__title pe-8 text-xl leading-heading font-strong tracking-title text-balance`}>{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className={`${root}__description text-sm leading-body text-pretty text-muted`}>
            {description}
          </DialogPrimitive.Description>
        ) : null}
        {children}
        {/* Last in the markup, so focus goes to the body's first control when the panel opens. */}
        <DialogPrimitive.Close
          className={`${root}__close absolute top-5 right-5 grid size-(--gx-h-sm) cursor-pointer place-items-center rounded-lg text-muted outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-2`}
          aria-label={messages.close}
        >
          <Icon name="close" size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
