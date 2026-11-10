import { Button, Callout, Dialog, DialogActions, DialogClose, DialogContent, DialogTrigger, toast } from '../../src'

export function Confirm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Remove from class</Button>
      </DialogTrigger>
      <DialogContent title="Remove Devon from this class?" description="Devon keeps the practice already done.">
        <DialogActions>
          <DialogClose asChild>
            <Button variant="soft">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast('Devon removed from Geometry · Period 3')}>Remove</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export function WithContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Publish practice</Button>
      </DialogTrigger>
      <DialogContent title={'Publish to Geometry · Period 3?'}>
        <Callout tone="warn">2 students have no graded answers yet.</Callout>
        <DialogActions>
          <DialogClose asChild>
            <Button variant="soft">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast('Published to Period 3', { tone: 'good' })}>Publish</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
