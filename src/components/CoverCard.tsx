import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../core/cx'

type Own = {
  cover: ReactNode
  title: string
  description?: ReactNode
  meta?: ReactNode
  className?: string
}
type AsLink = Own & Omit<ComponentProps<'a'>, keyof Own | 'children'> & { href: string }
type AsButton = Own & Omit<ComponentProps<'button'>, keyof Own | 'children'> & { href?: undefined }

/**
 * A card with a picture on top, then a title and one line: a tool, a resource, a saved document.
 * The whole card is one target: a link with `href`, a button without. So `cover` and `meta` hold nothing to click.
 */
export function CoverCard({ cover, title, description, meta, className, ...props }: AsLink | AsButton) {
  const classes = cx('gx-cover-card', className)
  const content = (
    <>
      <span className="gx-cover-card__cover">{cover}</span>
      <span className="gx-cover-card__body">
        <span className="gx-cover-card__title">{title}</span>
        {description ? <span className="gx-cover-card__description">{description}</span> : null}
        {meta ? <span className="gx-cover-card__meta">{meta}</span> : null}
      </span>
    </>
  )
  if (props.href !== undefined)
    return (
      <a className={classes} {...props}>
        {content}
      </a>
    )
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
