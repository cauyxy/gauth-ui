import type { ComponentProps, ElementType } from 'react'

/**
 * The props of a component: its own, and the native props of the element they go to (`id`, `style`, `data-*`, `aria-*`,
 * the events, `ref`). An own prop replaces a native one of the same name. `Drop` names the native props the component sets itself.
 */
export type Props<Root extends ElementType, Own = object, Drop extends PropertyKey = never> = Own & Omit<ComponentProps<Root>, keyof Own | Drop>
