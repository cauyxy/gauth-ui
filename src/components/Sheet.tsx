import { cva } from 'class-variance-authority'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/** A panel that slides in from an edge of the page: a student's details beside a roster, the filters on a phone. Focus stays inside; Escape closes it. */
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

/* The panel fills the height at its edge. It slides in; it fades out, faster than it came. */
const panel = cva(
  'gx-sheet fixed inset-y-0 z-(--gx-z-overlay) flex w-[min(420px,calc(100vw-2*var(--gx-space-4)))] flex-col gap-3.5 overflow-y-auto bg-white p-6 text-ink shadow-pop outline-none data-[state=closed]:animate-fade-out',
  {
    variants: {
      side: {
        start: 'gx-sheet--start left-0 rounded-r-3xl data-[state=open]:animate-slide-in',
        end: 'gx-sheet--end right-0 rounded-l-3xl data-[state=open]:animate-slide-in-end',
      },
    },
  },
)

/** The panel, on its scrim. `title` is its accessible name; `children` are the body. `side` is the edge it comes from. */
export function SheetContent({
  title,
  description,
  side = 'end',
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & { title: string; description?: ReactNode; side?: 'start' | 'end' }) {
  const { messages } = useLocale()
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="gx-sheet__scrim fixed inset-0 z-(--gx-z-overlay) bg-ink/40 animate-fade-in data-[state=closed]:animate-fade-out" />
      <DialogPrimitive.Content className={cn(panel({ side }), className)} {...props}>
        <DialogPrimitive.Title className="gx-sheet__title pe-8 text-xl leading-heading font-strong tracking-title text-balance">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="gx-sheet__description text-sm leading-body text-pretty text-muted">{description}</DialogPrimitive.Description>
        ) : null}
        {children}
        {/* Last in the markup, so focus goes to the body's first control when the sheet opens. */}
        <DialogPrimitive.Close
          className="gx-sheet__close absolute top-5 right-5 grid size-(--gx-h-sm) cursor-pointer place-items-center rounded-lg text-muted outline-0 transition-[color,background-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-2"
          aria-label={messages.close}
        >
          <Icon name="close" size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
