import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/** The steps of a flow, in order, with where the person is. `current` is the index of the current step, from 0. */
export function Stepper({ steps, current, className }: { steps: readonly string[]; current: number; className?: string }) {
  const { messages } = useLocale()
  return (
    <ol className={cx('gx-stepper', className)}>
      {steps.map((name, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming'
        return (
          <li key={i} data-state={state} aria-current={state === 'current' ? 'step' : undefined} className="gx-stepper__step">
            <span role="img" aria-label={messages.step(i + 1, state)} className="gx-stepper__mark">
              {state === 'done' ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <span className="gx-stepper__name">{name}</span>
          </li>
        )
      })}
    </ol>
  )
}
