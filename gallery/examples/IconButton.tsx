import { useState } from 'react'
import { Icon, IconButton, type IconName } from '../../src'

/* Every icon of the package, by its name. */
const ICONS: IconName[] = [
  'check', 'check-circle', 'chevron-down', 'chevron-left', 'chevron-right', 'arrow-up', 'arrow-left', 'arrow-right', 'close',
  'plus', 'more', 'search', 'copy', 'link', 'external', 'download', 'upload', 'printer', 'file', 'image', 'attach', 'mic',
  'stop', 'edit', 'trash', 'undo', 'quote', 'info', 'alert', 'thumbs-up', 'thumbs-down', 'calendar', 'clock', 'users',
]

export function Variants() {
  const [liked, setLiked] = useState(true)
  return (
    <>
      <IconButton label="Print">
        <Icon name="printer" />
      </IconButton>
      <IconButton label="Download" variant="soft">
        <Icon name="download" />
      </IconButton>
      <IconButton label="More" variant="outline">
        <Icon name="more" />
      </IconButton>
      <IconButton label="Send" variant="ink">
        <Icon name="arrow-up" />
      </IconButton>
      <IconButton label="Good reply" pressed={liked} onClick={() => setLiked(!liked)}>
        <Icon name="thumbs-up" />
      </IconButton>
      <IconButton label="Print" disabled>
        <Icon name="printer" />
      </IconButton>
    </>
  )
}

export function Sizes() {
  return (
    <>
      <IconButton label="Copy" size="sm">
        <Icon name="copy" />
      </IconButton>
      <IconButton label="Copy" size="lg" variant="outline">
        <Icon name="copy" />
      </IconButton>
      <IconButton label="Copy" size="xl" variant="soft">
        <Icon name="copy" />
      </IconButton>
    </>
  )
}

export function Icons() {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
      {ICONS.map((name) => (
        <span key={name} className="flex items-center gap-2 text-xs text-muted">
          <Icon name={name} className="flex-none text-ink" />
          {name}
        </span>
      ))}
    </div>
  )
}
