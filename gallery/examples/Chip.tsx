import { useState } from 'react'
import { Chip, Icon } from '../../src'

export function Tones() {
  return (
    <>
      <Chip>Period 3</Chip>
      <Chip tone="blue">HSG.SRT.B.5</Chip>
      <Chip tone="violet">+40 XP</Chip>
      <Chip tone="good">Done</Chip>
      <Chip tone="warn">Look here</Chip>
      <Chip tone="pink">New best</Chip>
      <Chip tone="ink">3</Chip>
      <Chip>
        <Icon name="users" />
        28 students
      </Chip>
    </>
  )
}

export function Removable() {
  const [files, setFiles] = useState<readonly string[]>(['Unit 4 worksheet.pdf', 'Exit ticket.docx'])
  const [codes, setCodes] = useState<readonly string[]>(['HSG.SRT.B.5'])
  return (
    <>
      {files.map((name) => (
        <Chip key={name} onRemove={() => setFiles(files.filter((f) => f !== name))} removeLabel={`Remove ${name}`}>
          <Icon name="file" />
          {name}
        </Chip>
      ))}
      {codes.map((code) => (
        <Chip key={code} tone="blue" onRemove={() => setCodes(codes.filter((c) => c !== code))}>
          {code}
        </Chip>
      ))}
    </>
  )
}
