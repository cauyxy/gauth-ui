import { Skeleton } from '../../src'

export function Lines() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}
