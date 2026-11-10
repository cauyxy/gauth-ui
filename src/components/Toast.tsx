import { Toast as ToastPrimitive } from 'radix-ui'
import { useSyncExternalStore } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ToastTone = 'neutral' | 'good' | 'warn'

type ToastAction = { label: string; onClick: () => void }
type Entry = { id: number; message: string; tone: ToastTone; description?: string; action?: ToastAction; open: boolean }

/* The toasts on screen. It lives outside React, so `toast()` works from an event handler, a fetch or a store. */
const NONE: Entry[] = []
let entries = NONE
let nextId = 0
const listeners = new Set<() => void>()

function set(next: Entry[]) {
  entries = next
  for (const listener of listeners) listener()
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
/* A closed toast stays in the list while it fades out; the next `toast()` drops it. */
const close = (id: number) => set(entries.map((entry) => (entry.id === id ? { ...entry, open: false } : entry)))

/**
 * Says in one line what just happened. `description` is a quieter second line: what, or where. `action` is one
 * button that takes it back ("Undo"); pressing it closes the toast.
 * It leaves by itself after 4 seconds, or after 8 when it has an action.
 */
export function toast(message: string, { tone = 'neutral', description, action }: { tone?: ToastTone; description?: string; action?: ToastAction } = {}) {
  set([...entries.filter((entry) => entry.open), { id: nextId++, message, tone, description, action, open: true }])
}

/** Where toasts appear. A product mounts it once, near the root. */
export function Toaster() {
  const { messages } = useLocale()
  const shown = useSyncExternalStore(
    subscribe,
    () => entries,
    () => NONE,
  )
  return (
    <ToastPrimitive.Provider label={messages.notifications} duration={4000}>
      {shown.map(({ id, message, tone, description, action, open }) => (
        <ToastPrimitive.Root
          key={id}
          open={open}
          duration={action ? 8000 : undefined}
          onOpenChange={(next) => {
            if (!next) close(id)
          }}
          className={cx('gx-toast', `gx-toast--${tone}`)}
        >
          {tone === 'good' ? <Icon name="check" size={16} className="gx-toast__mark" /> : null}
          {tone === 'warn' ? <span aria-hidden="true" className="gx-toast__mark" /> : null}
          <div className="gx-toast__text">
            <ToastPrimitive.Title>{message}</ToastPrimitive.Title>
            {description ? <ToastPrimitive.Description className="gx-toast__description">{description}</ToastPrimitive.Description> : null}
          </div>
          {action ? (
            <ToastPrimitive.Action altText={action.label} onClick={action.onClick} className="gx-toast__action">
              {action.label}
            </ToastPrimitive.Action>
          ) : null}
          <ToastPrimitive.Close className="gx-toast__dismiss" aria-label={messages.dismiss}>
            <Icon name="close" size={16} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport label={messages.notifications} className="gx-toaster" />
    </ToastPrimitive.Provider>
  )
}
