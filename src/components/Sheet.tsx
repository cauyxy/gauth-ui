'use client'

import { cva } from 'class-variance-authority'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { ModalFrame } from './Dialog.parts'

export type SheetContentProps = Props<typeof DialogPrimitive.Content, { title: string; description?: ReactNode; side?: 'start' | 'end' }>

/** A panel that slides in from an edge of the page: a student's details beside a roster, the filters on a phone. Focus stays inside; Escape closes it. */
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

/* The panel fills the height at its edge. It slides in; it fades out, faster than it came. */
const panel = cva('gx-sheet inset-y-0 w-[min(420px,calc(100vw-2*var(--gx-space-4)))] data-[state=closed]:animate-fade-out', {
  variants: {
    side: {
      start: 'gx-sheet--start left-0 rounded-r-3xl data-[state=open]:animate-slide-in',
      end: 'gx-sheet--end right-0 rounded-l-3xl data-[state=open]:animate-slide-in-end',
    },
  },
})

/** The panel, on its scrim. `title` is its accessible name; `children` are the body. `side` is the edge it comes from. */
export function SheetContent({ side = 'end', className, ...props }: SheetContentProps) {
  return <ModalFrame root="gx-sheet" className={cn(panel({ side }), className)} {...props} />
}
