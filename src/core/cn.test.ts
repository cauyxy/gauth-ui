import { cn } from './cn'

it('lets a later class replace an earlier one of the same kind', () => {
  expect(cn('bg-ink px-3', 'bg-white')).toBe('px-3 bg-white')
  expect(cn('shadow-edge', 'shadow-pop')).toBe('shadow-pop')
  expect(cn('text-sm', 'text-2xs')).toBe('text-2xs')
  expect(cn('font-control', 'font-strong')).toBe('font-strong')
  expect(cn('leading-body', 'leading-heading')).toBe('leading-heading')
  expect(cn('tracking-title', 'tracking-label')).toBe('tracking-label')
  expect(cn('ease-standard', 'ease-enter')).toBe('ease-enter')
  expect(cn('animate-spin', 'animate-pulse')).toBe('animate-pulse')
  /* A class from a product replaces a token written as a variable. */
  expect(cn('h-(--gx-h-md)', 'h-12')).toBe('h-12')
  expect(cn('duration-(--gx-dur-fast)', 'duration-(--gx-dur-base)')).toBe('duration-(--gx-dur-base)')
  expect(cn('z-(--gx-z-pop)', 'z-(--gx-z-toast)')).toBe('z-(--gx-z-toast)')
  expect(cn('size-[18px]', 'size-6')).toBe('size-6')
  expect(cn('rounded-lg px-3.5 text-sm', 'rounded-2xl px-6 text-base')).toBe('rounded-2xl px-6 text-base')
})

it('keeps two classes of different kinds', () => {
  expect(cn('shadow-outline', 'shadow-correct')).toBe('shadow-outline shadow-correct')
  expect(cn('text-2xs', 'text-muted')).toBe('text-2xs text-muted')
  expect(cn('font-sans', 'font-control')).toBe('font-sans font-control')
  expect(cn('h-(--gx-h-md)', 'px-3.5')).toBe('h-(--gx-h-md) px-3.5')
  expect(cn('leading-body text-sm', 'text-base')).toBe('leading-body text-base')
})

it('keeps the hook classes and leaves out what is empty', () => {
  expect(cn('gx-btn gx-btn--ink', false, null, undefined, 'bg-ink')).toBe('gx-btn gx-btn--ink bg-ink')
})
