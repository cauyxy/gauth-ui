import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'

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
  /* The hairline lies over the card (::after), so the picture does not hide it. */
  const classes = cn(
    "gx-cover-card relative flex w-full min-w-0 cursor-pointer flex-col rounded-2xl bg-white text-start text-ink no-underline outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-edge after:transition-shadow after:duration-(--gx-dur-fast) after:ease-standard after:content-[''] hover:after:shadow-edge-strong focus-visible:focus-ring focus-visible:outline-offset-2",
    className,
  )
  const content = (
    <>
      {/* The picture: 16 by 10, with the card's top corners. What is put in it fills it. */}
      <span className="gx-cover-card__cover relative grid aspect-16/10 flex-none grid-cols-1 grid-rows-1 overflow-hidden rounded-t-2xl bg-surface [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover">{cover}</span>
      <span className="gx-cover-card__body flex min-w-0 flex-1 flex-col gap-1 p-4">
        <span className="gx-cover-card__title truncate text-sm leading-heading font-title">{title}</span>
        {description ? <span className="gx-cover-card__description line-clamp-2 text-xs leading-body text-pretty text-muted">{description}</span> : null}
        {/* In a row of cards the meta lines share one bottom edge. */}
        {meta ? <span className="gx-cover-card__meta mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-muted">{meta}</span> : null}
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
