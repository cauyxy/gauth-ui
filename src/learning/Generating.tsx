import { Spinner } from '../components/Spinner'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type GeneratingStep = { label: string; state: 'done' | 'current' | 'upcoming' }

/** What Gauth AI shows while it builds something: the steps of the work, with the one it is on. `label` names the work. */
export function Generating({ steps, label, className }: { steps: readonly GeneratingStep[]; label?: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <div role="status" aria-label={label ?? messages.loading} className={cx('gx-generating', className)}>
      <ul className="gx-generating__list">
        {steps.map((step, i) => (
          <li key={i} data-state={step.state} aria-current={step.state === 'current' ? 'step' : undefined} className="gx-generating__step">
            <span aria-hidden="true" className="gx-generating__mark">
              {step.state === 'done' ? <Icon name="check" size={18} /> : step.state === 'current' ? <Spinner size={16} /> : null}
            </span>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
