import { Progress } from '../components/Progress'
import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/** Progress through a set: an ink bar and "2 of 6" after it. `label` is the bar's accessible name ("Practice set"). */
export function StepProgress({ done, total, label, className }: { done: number; total: number; label: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <Progress value={total > 0 ? Math.round((done / total) * 100) : 0} label={label} className={cx('gx-step-progress', className)}>
      {messages.stepOf(done, total)}
    </Progress>
  )
}
