import { Tabs as TabsPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

/**
 * Views of one thing, one shown at a time. `value` is the picked tab; `defaultValue` when the page does not keep it.
 * Tab moves to the picked tab; the arrow keys, Home and End move the pick.
 */
export function Tabs({
  onChange,
  className,
  ...props
}: Omit<ComponentProps<typeof TabsPrimitive.Root>, 'onChange' | 'onValueChange'> & { onChange?: (value: string) => void }) {
  return <TabsPrimitive.Root onValueChange={onChange} className={cx('gx-tabs', className)} {...props} />
}

export function TabList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cx('gx-tabs__list', className)} {...props} />
}

export function Tab({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger className={cx('gx-tabs__tab', className)} {...props} />
}

export function TabPanel({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cx('gx-tabs__panel', className)} {...props} />
}
