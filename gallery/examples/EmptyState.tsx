import { Button, EmptyState, Icon } from '../../src'

export function Kinds() {
  return (
    <div className="flex flex-wrap items-stretch gap-4">
      <EmptyState title="No practice sent yet" description="Pick a skill the class needs." action={<Button>Send practice</Button>} />
      <EmptyState title="This page didn't load" description="Check your connection." action={<Button variant="outline">Try again</Button>} />
      <EmptyState icon={<Icon name="search" />} title="No students match “Devn”" />
    </div>
  )
}
