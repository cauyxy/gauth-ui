import { Button, Panel, PanelHeader, Stat } from '../../src'

export function WithHeader() {
  return (
    <Panel className="w-full max-w-[34rem]">
      <PanelHeader title="Needs support">
        <Button variant="outline">Reteach</Button>
      </PanelHeader>
      <div className="flex flex-wrap items-center gap-4 p-5">
        <Stat label="Proficient" value="62%" sub="+8 pts" />
        <Stat label="Turned in" value="24" sub="of 28" />
      </div>
    </Panel>
  )
}
