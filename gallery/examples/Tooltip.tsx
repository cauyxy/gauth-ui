import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../../src'

export function OnAButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Similar triangles have equal angles.</TooltipContent>
    </Tooltip>
  )
}
