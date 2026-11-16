'use client'

import { useState, type DragEvent, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type FileDropzoneProps = Props<
  'input',
  { onChange: (files: File[]) => void; title?: ReactNode; hint?: ReactNode },
  'type' | 'children' | 'value' | 'defaultValue'
>

/** Whether a file is one `accept` allows: an extension (".pdf"), a type ("image/png") or a family ("image/*"). */
function accepts(file: File, accept?: string) {
  if (!accept) return true
  const name = file.name.toLowerCase()
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a))
}

/**
 * A place to drop files, or to click and choose them: a worksheet to grade, a photo of written work. `onChange` gets
 * the files that `accept` allows. `title` and `hint` are the product's words; without a title it says the shared one.
 * The native file input stays inside, so the keyboard and a screen reader work as usual: `className` goes to the drop
 * target, every other prop (`accept`, `multiple`, `disabled`) and `ref` to the `<input>`.
 */
export function FileDropzone({ onChange, accept, multiple = false, title, hint, disabled, className, ...props }: FileDropzoneProps) {
  const { messages } = useLocale()
  const [over, setOver] = useState(false)
  const take = (files: FileList | null) => {
    const picked = [...(files ?? [])].filter((f) => accepts(f, accept))
    if (picked.length) onChange(multiple ? picked : picked.slice(0, 1))
  }
  const onDragOver = (event: DragEvent) => {
    if (disabled) return
    event.preventDefault()
    setOver(true)
  }
  return (
    /* The drop target is the label; the keyboard and a screen reader use the file input inside it. */
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      data-over={over || undefined}
      onDragOver={onDragOver}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setOver(false)
        if (!disabled) take(event.dataTransfer.files)
      }}
      className={cn(
        'gx-file-dropzone flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-ring bg-white px-6 py-8 text-center transition-[background-color,border-color] duration-(--gx-dur-fast) ease-standard hover:bg-surface has-[input:focus-visible]:focus-ring has-[input:focus-visible]:outline-offset-2 has-disabled:cursor-default has-disabled:opacity-50 has-disabled:hover:bg-white data-[over]:border-ink data-[over]:bg-surface',
        className,
      )}
    >
      <span className="gx-file-dropzone__icon grid size-10 place-items-center rounded-full bg-track text-ink">
        <Icon name="upload" size={20} />
      </span>
      <span className="gx-file-dropzone__title text-sm font-control text-ink text-balance">{title ?? messages.dropFiles}</span>
      {hint ? <span className="gx-file-dropzone__hint text-xs text-pretty text-muted">{hint}</span> : null}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        {...props}
        onChange={(event) => {
          take(event.target.files)
          event.target.value = ''
        }}
        className="gx-file-dropzone__input gx-visually-hidden"
      />
    </label>
  )
}
