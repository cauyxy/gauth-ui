import { Breadcrumbs, Button, PageTitle } from '../../src'

export function WithActions() {
  return (
    <div className="w-full">
      <PageTitle
        title="Needs support"
        crumbs={
          <Breadcrumbs>
            <a href="#classes">Classes</a>
            <a href="#geometry-3">Geometry · Period 3</a>
          </Breadcrumbs>
        }
      >
        <Button variant="outline">Print</Button>
        <Button>Send practice</Button>
      </PageTitle>
    </div>
  )
}
