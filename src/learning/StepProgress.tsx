import { Progress } from '../components/Progress'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'

/** Progress through a set: an ink bar and "2 of 6" after it. `label` is the bar's accessible name ("Practice set"). The look is Progress; the count keeps its width as it grows. */
export function StepProgress({ done, total, label, className }: { done: number; total: number; label: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <Progress value={total > 0 ? Math.round((done / total) * 100) : 0} label={label} className={cn('gx-step-progress tabular-nums', className)}>
      {messages.stepOf(done, total)}
    </Progress>
  )
}
