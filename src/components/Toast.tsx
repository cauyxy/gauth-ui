import { Toast as ToastPrimitive } from 'radix-ui'
import { useSyncExternalStore } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ToastTone = 'neutral' | 'good' | 'warn'

type Entry = { id: number; message: string; tone: ToastTone; open: boolean }

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

/** Says in one line what just happened. It leaves by itself after 4 seconds. */
export function toast(message: string, { tone = 'neutral' }: { tone?: ToastTone } = {}) {
  set([...entries.filter((entry) => entry.open), { id: nextId++, message, tone, open: true }])
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
      {shown.map(({ id, message, tone, open }) => (
        <ToastPrimitive.Root
          key={id}
          open={open}
          onOpenChange={(next) => {
            if (!next) close(id)
          }}
          className={cx('gx-toast', `gx-toast--${tone}`)}
        >
          {tone === 'good' ? <Icon name="check" size={16} className="gx-toast__mark" /> : null}
          {tone === 'warn' ? <span aria-hidden="true" className="gx-toast__mark" /> : null}
          <ToastPrimitive.Description className="gx-toast__text">{message}</ToastPrimitive.Description>
          <ToastPrimitive.Close className="gx-toast__dismiss" aria-label={messages.dismiss}>
            <Icon name="close" size={16} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport label={messages.notifications} className="gx-toaster" />
    </ToastPrimitive.Provider>
  )
}
