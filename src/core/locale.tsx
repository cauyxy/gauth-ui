'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { MESSAGES, type Locale, type Messages } from './messages'

/** The `Intl` tag for each language. Dates and numbers follow US conventions in both. */
const INTL: Record<Locale, string> = { en: 'en-US', es: 'es-US' }

export type LocaleValue = {
  locale: Locale
  /** The `Intl` tag for the language, for a format the content rules do not fix (a month in a calendar). */
  intl: string
  messages: Messages
  /** A day the way the product writes it: "Fri, Oct 23". */
  formatDay: (date: Date) => string
  /** A change in a share, in points and never in percent: "+8 pts". */
  formatDelta: (points: number) => string
}

function valueFor(locale: Locale, messages: Messages): LocaleValue {
  const day = new Intl.DateTimeFormat(INTL[locale], { weekday: 'short', month: 'short', day: 'numeric' })
  return {
    locale,
    intl: INTL[locale],
    messages,
    formatDay: (date) => day.format(date),
    formatDelta: (points) => `${points > 0 ? '+' : points < 0 ? '−' : ''}${Math.abs(points)} pts`,
  }
}

export type LocaleProviderProps = { locale: Locale; messages?: Partial<Messages>; children: ReactNode }

const LocaleContext = createContext<LocaleValue>(valueFor('en', MESSAGES.en))
LocaleContext.displayName = 'Locale'

/**
 * Sets the language of every component inside it. Without one, components speak English.
 * `messages` replaces single strings, for a product that needs its own word for one of them.
 */
export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const value = useMemo(() => valueFor(locale, { ...MESSAGES[locale], ...messages }), [locale, messages])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

/** The current language, its strings, and the two formats the content rules fix. */
export const useLocale = () => useContext(LocaleContext)
