'use client'

import { Slider as SliderPrimitive } from 'radix-ui'
import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'

export type SliderProps = Props<
  typeof SliderPrimitive.Root,
  { value?: number; defaultValue?: number; onChange?: (value: number) => void; label: string; formatValue?: (value: number) => string },
  'onValueChange' | 'onValueCommit' | 'orientation' | 'inverted' | 'minStepsBetweenThumbs' | 'children' | 'asChild'
>

/**
 * A number picked by dragging along a track: a goal, a share, a length. `label` is its accessible name; `formatValue`
 * says the value in words for a screen reader ("12 questions"). The arrow keys move one step, Page Up and Down ten,
 * Home and End to the ends. `value` is the number the product keeps; `defaultValue` when the slider keeps its own
 * (it starts at `min`). `onChange` gets the new number. `min` is 0, `max` 100 and `step` 1 unless given.
 */
export function Slider({ value, defaultValue, onChange, min = 0, label, formatValue, className, ...props }: SliderProps) {
  const [current, set] = useControllable(value, defaultValue ?? min, onChange)
  return (
    <SliderPrimitive.Root
      min={min}
      {...props}
      value={[current]}
      onValueChange={([next]) => set(next!)}
      className={cn('gx-slider relative flex h-(--gx-h-sm) w-full min-w-[8rem] touch-none items-center select-none data-[disabled]:opacity-50', className)}
    >
      <SliderPrimitive.Track className="gx-slider__track relative h-1.5 grow overflow-hidden rounded-full bg-track">
        <SliderPrimitive.Range className="gx-slider__range absolute h-full bg-ink" />
      </SliderPrimitive.Track>
      {/* A white thumb with the ink ring of a picked item: it reads on the ink range and on the empty track. */}
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={formatValue?.(current)}
        className="gx-slider__thumb block size-[18px] cursor-grab rounded-full bg-white shadow-outline outline-0 transition-transform duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 active:cursor-grabbing data-[disabled]:cursor-default"
      />
    </SliderPrimitive.Root>
  )
}
