import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/** Questions to tap under the last reply, one per row. A tap gives the question to `onPick`; the page sends it. */
export function FollowUps({ items, onPick, className }: { items: readonly string[]; onPick: (item: string) => void; className?: string }) {
  const { messages } = useLocale()
  if (!items.length) return null
  return (
    <div role="group" aria-label={messages.followUps} className={cx('gx-follow-ups', className)}>
      {items.map((item) => (
        <button key={item} type="button" onClick={() => onPick(item)} className="gx-follow-ups__item">
          {item}
        </button>
      ))}
    </div>
  )
}
