import { useState } from 'react'
import { Switch } from '../../src'

export function OnAndOff() {
  const [hints, setHints] = useState(true)
  const [aloud, setAloud] = useState(false)
  return (
    <>
      <Switch checked={hints} onChange={setHints} label="Show hints" />
      <Switch checked={aloud} onChange={setAloud} label="Read aloud" />
    </>
  )
}
