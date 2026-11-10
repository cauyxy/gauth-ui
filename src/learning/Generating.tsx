import { Spinner } from '../components/Spinner'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type GeneratingStep = { label: string; state: 'done' | 'current' | 'upcoming' }

/** What Gauth AI shows while it builds something: the steps of the work, with the one it is on. `label` names the work. */
export function Generating({ steps, label, className }: { steps: readonly GeneratingStep[]; label?: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <div role="status" aria-label={label ?? messages.loading} className={cn('gx-generating', className)}>
      <ul className="gx-generating__list flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li
            key={i}
            data-state={step.state}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className="gx-generating__step group flex items-center gap-2.5 text-sm text-muted data-[state=current]:font-control data-[state=current]:text-ink"
          >
            {/* Not started yet: a small empty ring, 8px inside its line. The browser draws a 1.5px line as 1px or 1.5px by the screen, so the ring's size is its inside. */}
            <span
              aria-hidden="true"
              className="gx-generating__mark grid size-[18px] flex-none place-items-center group-data-[state=done]:text-good-mid group-data-[state=upcoming]:after:box-content group-data-[state=upcoming]:after:size-[8px] group-data-[state=upcoming]:after:rounded-full group-data-[state=upcoming]:after:border-[1.5px] group-data-[state=upcoming]:after:border-ring group-data-[state=upcoming]:after:content-['']"
            >
              {step.state === 'done' ? <Icon name="check" size={18} /> : step.state === 'current' ? <Spinner size={16} /> : null}
            </span>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
