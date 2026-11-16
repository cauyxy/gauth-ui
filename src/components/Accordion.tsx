import { Accordion as AccordionPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'

/**
 * Sections that open and close under their titles: a unit's lessons, the answers to common questions.
 * `type="single"` keeps one open (add `collapsible` to let it close); `type="multiple"` lets each open by itself.
 * The arrow keys move between titles, Home and End go to the first and the last.
 */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cn('gx-accordion flex flex-col', className)} {...props} />
}

/** One section: `title` is the line that opens it, `children` what it shows. `meta` sits at the end of the title line. */
export function AccordionItem({
  value,
  title,
  meta,
  children,
  disabled,
  className,
}: {
  value: string
  title: ReactNode
  meta?: ReactNode
  children: ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <AccordionPrimitive.Item value={value} disabled={disabled} className={cn('gx-accordion__item group border-b border-line', className)}>
      <AccordionPrimitive.Header className="gx-accordion__header flex">
        <AccordionPrimitive.Trigger className="gx-accordion__trigger flex min-h-(--gx-h-xl) flex-1 cursor-pointer items-center gap-3 rounded-lg py-3 text-start text-sm font-control text-ink outline-0 focus-visible:focus-ring focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50">
          <span className="gx-accordion__title min-w-0 flex-1 text-pretty">{title}</span>
          {meta ? <span className="gx-accordion__meta flex-none text-xs font-body text-muted">{meta}</span> : null}
          <Icon
            name="chevron-down"
            size={16}
            className="gx-accordion__icon flex-none text-muted transition-transform duration-(--gx-dur-base) ease-standard group-data-[state=open]:rotate-180"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="gx-accordion__content pb-4 text-sm leading-body text-pretty text-ink-soft data-[state=open]:animate-rise-in">
        {children}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
