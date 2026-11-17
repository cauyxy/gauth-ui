import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { THEME_NAMES } from './theme-names'

/*
 * The names of theme.css, which `pnpm tokens` writes from tokens.css. With them, a later class replaces an earlier one of
 * the same kind (`shadow-edge` then `shadow-pop`), and two of different kinds both stay (`shadow-outline shadow-correct`,
 * `text-2xs text-muted`).
 */
const merge = extendTailwindMerge({
  /* A type size here sets no line height (theme.css has none), so `text-base` after `leading-body` keeps both. */
  override: { conflictingClassGroups: { 'font-size': [] } },
  extend: { theme: THEME_NAMES },
})

/** Joins class names. Of two Tailwind classes for the same property the later one stays, so a product's `className` wins. */
export const cn = (...parts: ClassValue[]) => merge(clsx(parts))
