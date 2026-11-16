import { Slider as SliderPrimitive } from 'radix-ui'
import { cn } from '../core/cn'

/**
 * A number picked by dragging along a track: a goal, a share, a length. `label` is its accessible name; `formatValue`
 * says the value in words for a screen reader ("12 questions"). The arrow keys move one step, Page Up and Down ten,
 * Home and End to the ends. `onChange` gets the new number.
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  disabled,
  name,
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  formatValue?: (value: number) => string
  disabled?: boolean
  name?: string
  className?: string
}) {
  return (
    <SliderPrimitive.Root
      value={[value]}
      onValueChange={([next]) => onChange(next!)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      name={name}
      className={cn('gx-slider relative flex h-(--gx-h-sm) w-full min-w-[8rem] touch-none items-center select-none data-[disabled]:opacity-50', className)}
    >
      <SliderPrimitive.Track className="gx-slider__track relative h-1.5 grow overflow-hidden rounded-full bg-track">
        <SliderPrimitive.Range className="gx-slider__range absolute h-full bg-ink" />
      </SliderPrimitive.Track>
      {/* A white thumb with the ink ring of a picked item: it reads on the ink range and on the empty track. */}
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={formatValue?.(value)}
        className="gx-slider__thumb block size-[18px] cursor-grab rounded-full bg-white shadow-outline outline-0 transition-transform duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 active:cursor-grabbing data-[disabled]:cursor-default"
      />
    </SliderPrimitive.Root>
  )
}
