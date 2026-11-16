'use client'

import { Tabs as TabsPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type TabsProps = Props<typeof TabsPrimitive.Root, { onChange?: (value: string) => void }, 'onValueChange'>
export type TabListProps = ComponentProps<typeof TabsPrimitive.List>
export type TabProps = ComponentProps<typeof TabsPrimitive.Trigger>
export type TabPanelProps = ComponentProps<typeof TabsPrimitive.Content>

/**
 * Views of one thing, one shown at a time. `value` is the picked tab; `defaultValue` when the page does not keep it.
 * Tab moves to the picked tab; the arrow keys, Home and End move the pick.
 */
export function Tabs({ onChange, className, ...props }: TabsProps) {
  return <TabsPrimitive.Root onValueChange={onChange} className={cn('gx-tabs', className)} {...props} />
}

export function TabList({ className, ...props }: TabListProps) {
  return <TabsPrimitive.List className={cn('gx-tabs__list flex gap-5 border-b border-line', className)} {...props} />
}

export function Tab({ className, ...props }: TabProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        /* The tab's own underline sits on the list's rule. */
        'gx-tabs__tab -mb-px flex-none cursor-pointer border-b-2 border-transparent py-2.5 text-sm font-control whitespace-nowrap text-muted outline-0 transition-[color] duration-(--gx-dur-fast) ease-standard hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:border-ink aria-selected:text-ink',
        className,
      )}
      {...props}
    />
  )
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <TabsPrimitive.Content className={cn('gx-tabs__panel outline-0 focus-visible:focus-ring focus-visible:outline-offset-2', className)} {...props} />
}
