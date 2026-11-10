import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/** A question or a short task that takes over the page until the person answers it. Focus stays inside; Escape closes it. */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

/** The row of answers at the end of a dialog: right-aligned, the main answer last. */
export function DialogActions({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('gx-dialog__actions', className)} {...props} />
}

/** The panel, on its scrim. `title` is its accessible name; `children` are the body, then `DialogActions`. */
export function DialogContent({
  title,
  description,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & { title: string; description?: ReactNode }) {
  const { messages } = useLocale()
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="gx-dialog__scrim" />
      <DialogPrimitive.Content className={cx('gx-dialog', className)} {...props}>
        <DialogPrimitive.Title className="gx-dialog__title">{title}</DialogPrimitive.Title>
        {description ? <DialogPrimitive.Description className="gx-dialog__description">{description}</DialogPrimitive.Description> : null}
        {children}
        {/* Last in the markup, so focus goes to the body's first control when the dialog opens. */}
        <DialogPrimitive.Close className="gx-dialog__close" aria-label={messages.close}>
          <Icon name="close" size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
