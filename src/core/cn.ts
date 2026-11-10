import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * The names in theme.css that Tailwind's own scale does not have. With them, a later class replaces an earlier one of the
 * same kind (`shadow-edge` then `shadow-pop`), and two of different kinds both stay (`shadow-outline shadow-correct`,
 * `text-2xs text-muted`).
 */
const merge = extendTailwindMerge({
  /* A type size here sets no line height (theme.css has none), so `text-base` after `leading-body` keeps both. */
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: {
    theme: {
      shadow: ['card', 'edge', 'edge-strong', 'pop', 'raise', 'outline', 'box', 'invalid'],
      text: ['3xs', '2xs'],
      'font-weight': ['body', 'control', 'title', 'strong'],
      leading: ['figure', 'title', 'heading', 'body'],
      tracking: ['display', 'title', 'label'],
      ease: ['standard', 'enter'],
      animate: ['fade-in', 'fade-out', 'pop-in', 'pop-out', 'tip-in', 'rise-in', 'slide-in', 'mark-right', 'mark-retry', 'pulse', 'spin', 'sweep'],
    },
  },
})

/** Joins class names. Of two Tailwind classes for the same property the later one stays, so a product's `className` wins. */
export const cn = (...parts: ClassValue[]) => merge(clsx(parts))
