'use client'

import { useState } from 'react'

/**
 * A value that the product keeps or the component keeps. With `value` the product keeps it and the component only asks
 * for a change; without it the component keeps its own, starting at `defaultValue`. `null` is a value (nothing picked):
 * only `undefined` leaves it to the component. `Next` is what a change can be, when that is less than the value can be
 * (a pick cannot be taken back to nothing). Returns the value, how to change it, and whether the product keeps it.
 */
export function useControllable<Value, Next extends Value = Value>(
  value: Value | undefined,
  defaultValue: Value,
  onChange?: (next: Next) => void,
): [Value, (next: Next) => void, boolean] {
  const [own, setOwn] = useState(defaultValue)
  const controlled = value !== undefined
  const set = (next: Next) => {
    if (!controlled) setOwn(next)
    onChange?.(next)
  }
  return [controlled ? value : own, set, controlled]
}
