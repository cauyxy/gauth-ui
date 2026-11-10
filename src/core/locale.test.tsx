import { render, screen } from '@testing-library/react'
import { LocaleProvider, useLocale } from './locale'
import { en, es, LEVELS, MESSAGES } from './messages'

function Probe() {
  const { messages, formatDay, formatDelta } = useLocale()
  return (
    <p>
      {messages.notYet} · {messages.stepOf(2, 6)} · {messages.levels.proficient} · {formatDay(new Date(2026, 9, 23))} · {formatDelta(8)} ·{' '}
      {formatDelta(-3)}
    </p>
  )
}

it('speaks English without a provider', () => {
  render(<Probe />)
  expect(screen.getByText('Not yet · 2 of 6 · Proficient · Fri, Oct 23 · +8 pts · −3 pts')).toBeInTheDocument()
})

it('speaks Spanish inside a Spanish provider', () => {
  render(
    <LocaleProvider locale="es">
      <Probe />
    </LocaleProvider>,
  )
  expect(screen.getByText(/^Todavía no · 2 de 6 · Competente · vie.*23.* · \+8 pts · −3 pts$/)).toBeInTheDocument()
})

it('lets a product replace one string and keeps the rest', () => {
  render(
    <LocaleProvider locale="en" messages={{ notYet: 'Almost' }}>
      <Probe />
    </LocaleProvider>,
  )
  expect(screen.getByText(/^Almost · 2 of 6 · Proficient/)).toBeInTheDocument()
})

it('has every string in every language, and none left in English', () => {
  for (const locale of Object.keys(MESSAGES) as (keyof typeof MESSAGES)[]) expect(Object.keys(MESSAGES[locale]).sort()).toEqual(Object.keys(en).sort())
  const same = (Object.keys(en) as (keyof typeof en)[]).filter((k) => typeof en[k] === 'string' && en[k] === es[k])
  expect(same).toEqual([])
  for (const level of LEVELS) expect(es.levels[level]).not.toBe(en.levels[level])
})
