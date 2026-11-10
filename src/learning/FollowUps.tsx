import { cn } from '../core/cn'
import { useLocale } from '../core/locale'

/** Questions to tap under the last reply, one per row. A tap gives the question to `onPick`; the page sends it. */
export function FollowUps({ items, onPick, className }: { items: readonly string[]; onPick: (item: string) => void; className?: string }) {
  const { messages } = useLocale()
  if (!items.length) return null
  return (
    <div role="group" aria-label={messages.followUps} className={cn('gx-follow-ups flex min-w-0 flex-col items-start gap-2', className)}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="gx-follow-ups__item min-h-(--gx-h-md) max-w-full cursor-pointer rounded-xl bg-white px-3 py-2 text-start text-sm leading-heading wrap-anywhere text-ink-soft shadow-edge-strong outline-0 transition-[background-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface focus-visible:focus-ring focus-visible:outline-offset-2"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
