import { Button } from '../../src'

export function Variants() {
  return (
    <>
      <Button>Assign</Button>
      <Button variant="soft">Review</Button>
      <Button variant="outline">Reteach</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="link">See all</Button>
      <Button disabled>Assign</Button>
    </>
  )
}

export function Sizes() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Check answer</Button>
    </>
  )
}
