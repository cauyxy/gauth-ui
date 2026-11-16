'use client'

import { Toast as ToastPrimitive } from 'radix-ui'
import { useSyncExternalStore } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ToastTone = 'neutral' | 'good' | 'warn'

export type ToastAction = { label: string; onClick: () => void }
export type ToastOptions = { tone?: ToastTone; description?: string; action?: ToastAction }
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
 * A toast that says the same as one still on screen takes its place: one toast, with a new 4 seconds.
 * A toast with an action is never taken away by another: each one takes back its own thing.
 */
export function toast(message: string, { tone = 'neutral', description, action }: ToastOptions = {}) {
  /* The same words and tone are the same toast to the person who reads it, whatever caused it: five presses on "Copy link" are one "Link copied". */
  const repeats = (entry: Entry) => !action && !entry.action && entry.message === message && entry.tone === tone && entry.description === description
  /* It gets a new id, so it is a new toast for React and Radix: the old one goes at once, and this one comes in where the newest stands and is said again. */
  set([...entries.filter((entry) => entry.open && !repeats(entry)), { id: nextId++, message, tone, description, action, open: true }])
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
          className={cn(
            'gx-toast pointer-events-auto flex min-h-(--gx-h-lg) max-w-[min(26rem,100%)] animate-pop-in items-center gap-2.5 rounded-xl bg-ink py-1 pr-1.5 pl-4 text-sm leading-heading font-control text-white shadow-pop outline-0 focus-visible:focus-ring focus-visible:outline-offset-2 data-[state=closed]:animate-fade-out',
            `gx-toast--${tone}`,
          )}
        >
          {/* The tone has a shape as well as a color: a check for good, a dot for warn, nothing for neutral. With a second line the mark stays on the first one: the text's top padding, half a line, less half the mark. */}
          {tone === 'good' ? (
            <Icon
              name="check"
              size={16}
              className={cn('gx-toast__mark flex-none text-correct', description && 'mt-[calc(var(--gx-space-1-5)+0.5lh-8px)] self-start')}
            />
          ) : null}
          {tone === 'warn' ? (
            <span
              aria-hidden="true"
              className={cn(
                'gx-toast__mark size-[8px] flex-none rounded-full bg-attempted',
                description && 'mt-[calc(var(--gx-space-1-5)+0.5lh-4px)] self-start',
              )}
            />
          ) : null}
          <div className="gx-toast__text min-w-0 py-1.5">
            <ToastPrimitive.Title>{message}</ToastPrimitive.Title>
            {/* The second line: smaller and quieter. White at 72% on ink is still over 4.5:1. */}
            {description ? (
              <ToastPrimitive.Description className="gx-toast__description text-xs font-body [color:color-mix(in_srgb,var(--gx-color-white)_72%,transparent)]">
                {description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          {/* The one action: underlined white text, as high as the dismiss button beside it. On the ink ground the ring is white and inside the button: blue on ink is under 3:1. */}
          {action ? (
            <ToastPrimitive.Action
              altText={action.label}
              onClick={action.onClick}
              className="gx-toast__action h-(--gx-h-sm) flex-none cursor-pointer rounded-lg px-2 whitespace-nowrap underline underline-offset-[3px] outline-0 transition-[background-color] duration-(--gx-dur-fast) ease-standard hover:bg-[color-mix(in_srgb,var(--gx-color-white)_16%,transparent)] focus-visible:focus-ring focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              {action.label}
            </ToastPrimitive.Action>
          ) : null}
          <ToastPrimitive.Close
            className={cn(
              'gx-toast__dismiss grid size-(--gx-h-sm) flex-none cursor-pointer place-items-center rounded-lg outline-0 transition-[background-color] duration-(--gx-dur-fast) ease-standard hover:bg-[color-mix(in_srgb,var(--gx-color-white)_16%,transparent)] focus-visible:focus-ring focus-visible:-outline-offset-2 focus-visible:outline-white',
              action && '-ms-1.5',
            )}
            aria-label={messages.dismiss}
          >
            <Icon name="close" size={16} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      {/* The list of toasts: bottom center. It takes no clicks itself, so the page under it still works. */}
      <ToastPrimitive.Viewport
        label={messages.notifications}
        className="gx-toaster pointer-events-none fixed inset-x-0 bottom-0 z-(--gx-z-toast) flex flex-col items-center gap-2 p-4 outline-none"
      />
    </ToastPrimitive.Provider>
  )
}
