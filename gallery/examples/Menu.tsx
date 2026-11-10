import { Button, Icon, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, toast } from '../../src'

export function OnAButton() {
  return (
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
  )
}
