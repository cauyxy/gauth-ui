import { Button } from '../src/components/Button'
import { Callout } from '../src/components/Callout'
import { Dialog, DialogActions, DialogClose, DialogContent, DialogTrigger } from '../src/components/Dialog'
import { EmptyState } from '../src/components/EmptyState'
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '../src/components/Menu'
import { toast, Toaster } from '../src/components/Toast'
import { Icon } from '../src/core/Icon'
import { Section } from './section'

export default function Overlays() {
  return (
    <>
      <Section title="Dialog">
        <div className="g-row">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Publish practice</Button>
            </DialogTrigger>
            <DialogContent title={'Publish to Geometry\u00a0· Period 3?'}>
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
        </div>
      </Section>

      <Section title="Menu">
        <div className="g-row">
          <Menu>
            <MenuTrigger asChild>
              <Button variant="outline">
                Devon Carter
                <Icon name="chevron-down" size={16} />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onSelect={() => toast('Devon Carter: 4 of 6 skills at Proficient')}>View progress</MenuItem>
              <MenuItem onSelect={() => toast('Practice sent to Devon', { tone: 'good' })}>Send practice</MenuItem>
              <MenuItem disabled>Message family</MenuItem>
              <MenuSeparator />
              <MenuItem onSelect={() => toast('Devon removed from Geometry · Period 3')}>Remove from class</MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </Section>

      <Section title="Toast">
        <div className="g-row">
          <Button variant="outline" onClick={() => toast('Link copied')}>
            Copy link
          </Button>
          <Button variant="outline" onClick={() => toast('Published to Period 3', { tone: 'good' })}>
            Publish
          </Button>
          <Button variant="outline" onClick={() => toast('Not saved. Try again.', { tone: 'warn' })}>
            Save offline
          </Button>
          <Button
            variant="outline"
            onClick={() => toast('Assigned', { tone: 'good', description: 'Exit ticket · Geometry · Period 3' })}
          >
            Assign
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast('Devon removed from Period 3', {
                action: { label: 'Undo', onClick: () => toast('Devon is back in Period 3', { tone: 'good' }) },
              })
            }
          >
            Remove student
          </Button>
        </div>
        <Toaster />
      </Section>

      <Section title="EmptyState">
        <div className="g-row" style={{ alignItems: 'stretch' }}>
          <EmptyState title="No practice sent yet" description="Pick a skill the class needs." action={<Button>Send practice</Button>} />
          <EmptyState
            title="This page didn't load"
            description="Check your connection."
            action={<Button variant="outline">Try again</Button>}
          />
          <EmptyState icon={<Icon name="search" />} title="No students match “Devn”" />
        </div>
      </Section>

      <Section title="Callout">
        <div className="g-col">
          <Callout>Scores update after each practice set.</Callout>
          <Callout tone="warn">2 students have no graded answers yet.</Callout>
          <Callout tone="good">You moved to Familiar on this skill.</Callout>
          <Callout tone="ai">Only you see this: the answer key and worked solution.</Callout>
          <Callout tone="ai" title="Made by Gauth AI">
            6 problems on HSG.SRT.B.5, checked against the answer key.
          </Callout>
        </div>
      </Section>
    </>
  )
}
