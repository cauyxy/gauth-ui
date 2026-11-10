import { Button, toast } from '../../src'

/* A product mounts <Toaster /> once, near its root. toast() then works from anywhere. */
export function Kinds() {
  return (
    <>
      <Button variant="outline" onClick={() => toast('Link copied')}>
        Copy link
      </Button>
      <Button variant="outline" onClick={() => toast('Published to Period 3', { tone: 'good' })}>
        Publish
      </Button>
      <Button variant="outline" onClick={() => toast('Not saved. Try again.', { tone: 'warn' })}>
        Save offline
      </Button>
      <Button variant="outline" onClick={() => toast('Assigned', { tone: 'good', description: 'Exit ticket · Geometry · Period 3' })}>
        Assign
      </Button>
      <Button
        variant="outline"
        onClick={() => toast('Devon removed from Period 3', { action: { label: 'Undo', onClick: () => toast('Devon is back in Period 3', { tone: 'good' }) } })}
      >
        Remove student
      </Button>
    </>
  )
}
