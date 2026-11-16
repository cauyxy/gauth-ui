import { cva } from 'class-variance-authority'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { useId, useState, type KeyboardEvent } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import { useField } from './Field'
import { PopoverContent } from './Popover'

export type ComboboxSize = 'md' | 'xl'
export type ComboboxOption<T extends string> = { value: T; label: string; description?: string }

/* The box of an Input. The list under it is the look of a Menu. */
const control = cva(
  'gx-combobox__control block w-full appearance-none bg-white text-ink shadow-edge-strong outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard placeholder:text-muted focus-visible:focus-ring focus-visible:outline-offset-1 disabled:opacity-50 aria-invalid:bg-attempted-soft aria-invalid:shadow-invalid',
  {
    variants: {
      size: {
        md: 'h-(--gx-h-md) rounded-lg ps-3 pe-8 text-sm',
        xl: 'h-(--gx-h-xl) rounded-2xl ps-4 pe-10 text-base',
      },
    },
  },
)
const chevron = cva('gx-combobox__icon pointer-events-none absolute inset-y-0 my-auto text-muted', {
  variants: { size: { md: 'end-[calc(var(--gx-space-2-5)-1px)]', xl: 'end-[calc(var(--gx-space-3-5)-1px)]' } },
})

/**
 * One choice from a long list, found by typing: a student, a standard, a school. Typing filters the list; the arrow
 * keys move through it, Enter picks, Escape closes. The text goes back to the picked option's label when the field
 * loses focus. Inside a `Field` it takes its label, hint and error from the Field; alone, `label` is its accessible name.
 */
export function Combobox<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  label,
  placeholder,
  disabled,
  className,
}: {
  options: readonly ComboboxOption<T>[]
  value: T | null
  onChange: (value: T) => void
  size?: ComboboxSize
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}) {
  const { messages } = useLocale()
  const field = useField()
  const listId = useId()
  const [open, setOpen] = useState(false)
  /* What the person typed; null shows the picked option's label. */
  const [query, setQuery] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const picked = options.find((o) => o.value === value)
  const words = query?.trim().toLowerCase() ?? ''
  const shown = words ? options.filter((o) => `${o.label} ${o.description ?? ''}`.toLowerCase().includes(words)) : options
  const optionId = (i: number) => `${listId}-${i}`

  const show = () => {
    setOpen(true)
    setActive(
      Math.max(
        0,
        shown.findIndex((o) => o.value === value),
      ),
    )
  }
  const close = () => {
    setOpen(false)
    setQuery(null)
  }
  const pick = (option: ComboboxOption<T>) => {
    onChange(option.value)
    close()
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const last = shown.length - 1
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return show()
      const down = event.key === 'ArrowDown'
      setActive(active >= last && down ? 0 : active <= 0 && !down ? last : active + (down ? 1 : -1))
    } else if (event.key === 'Enter' && open && shown[active]) {
      event.preventDefault()
      pick(shown[active])
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      close()
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(next) => (next ? show() : close())}>
      <PopoverPrimitive.Anchor asChild>
        <span className={cn('gx-combobox relative block min-w-0', `gx-combobox--${size}`, className)}>
          <input
            type="text"
            role="combobox"
            id={field?.id}
            aria-describedby={field?.describedBy}
            aria-invalid={field?.invalid || undefined}
            aria-label={label}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && shown[active] ? optionId(active) : undefined}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={query ?? picked?.label ?? ''}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
              setOpen(true)
            }}
            onClick={() => (open ? undefined : show())}
            onKeyDown={onKeyDown}
            onBlur={close}
            className={control({ size })}
          />
          <Icon name="chevron-down" size={16} className={chevron({ size })} />
        </span>
      </PopoverPrimitive.Anchor>
      <PopoverContent
        arrow={false}
        align="start"
        sideOffset={6}
        className="w-(--radix-popover-trigger-width) min-w-[220px] rounded-xl p-1.5"
        /* Focus stays in the field: the list is read through aria-activedescendant. */
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if ((event.target as Element).closest?.('.gx-combobox')) event.preventDefault()
        }}
      >
        {shown.length ? (
          /* The WAI-ARIA combobox: the field keeps focus and takes the keys; the list and its options are read through aria-activedescendant. */
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          <ul id={listId} role="listbox" aria-label={label} className="gx-combobox__list flex flex-col">
            {shown.map((o, i) => (
              // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={o.value}
                id={optionId(i)}
                // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="option"
                aria-selected={o.value === value}
                data-active={i === active || undefined}
                /* A press keeps focus in the field; the click then picks. */
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActive(i)}
                onClick={() => pick(o)}
                className="gx-combobox__option flex min-h-(--gx-h-md) cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm leading-heading font-control text-ink select-none data-[active]:bg-surface"
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{o.label}</span>
                  {o.description ? <span className="gx-combobox__description truncate text-xs font-body text-muted">{o.description}</span> : null}
                </span>
                {o.value === value ? <Icon name="check" size={16} className="gx-combobox__check flex-none" /> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="gx-combobox__empty px-2.5 py-2 text-sm text-muted">{messages.noResults}</p>
        )}
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}
