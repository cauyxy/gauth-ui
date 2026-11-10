import type { CSSProperties } from 'react'
import { cx } from '../core/cx'

/** A grey block standing in for content that is still loading. Give it a size with `className` or `style`. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={cx('gx-skeleton', className)} style={style} />
}

/**
 * A page's body while its data loads: a title, then panels of rows, so the page takes its shape at once instead of
 * reading "Loading…". It fades in after 150 ms, so a page whose data is already on the way never flashes it.
 */
export function PageSkeleton({
  panels = 2,
  rows = 3,
  label = 'Loading',
  className,
}: {
  panels?: number
  rows?: number
  label?: string
  className?: string
}) {
  return (
    <div role="status" aria-label={label} className={cx('gx-page-skeleton', className)}>
      <span className="gx-page-skeleton__title">
        <Skeleton style={{ height: '2rem', width: 'min(340px, 70%)' }} />
        <Skeleton style={{ height: '1rem', width: 'min(220px, 50%)' }} />
      </span>
      {[...Array(panels).keys()].map((p) => (
        <section key={p} className="gx-page-skeleton__panel">
          <Skeleton style={{ height: '1rem', width: '8rem' }} />
          {[...Array(rows).keys()].map((r) => (
            <span key={r} className="gx-page-skeleton__row">
              <Skeleton className="gx-page-skeleton__dot" />
              <span className="gx-page-skeleton__lines">
                <Skeleton style={{ height: '0.875rem', width: '60%' }} />
                <Skeleton style={{ height: '0.75rem', width: '35%' }} />
              </span>
            </span>
          ))}
        </section>
      ))}
    </div>
  )
}
