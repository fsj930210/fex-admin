import { Card } from '@fex-design/react/ui/card'
import { Link } from 'react-router'
import { ClassicBreadcrumb } from './classic-breadcrumb'
import { CapsuleBreadcrumb } from './capsule-breadcrumb'
import { ParallelogramBreadcrumb } from './parallelogram-breadcrumb'
import { RibbonBreadcrumb } from './ribbon-breadcrumb'
import { DropdownBreadcrumb } from './dropdown-breadcrumb'

export function BreadcrumbPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Breadcrumb</h1>
          <p className="text-sm text-muted-foreground">
            Composable navigation trails with links, current pages, custom separators and menu
            triggers.
          </p>
        </header>
        <div className="space-y-space-xl">
          <Card title="Classic" description="Links and the current page use different semantics.">
            <ClassicBreadcrumb />
          </Card>
          <Card title="Custom separator" description="The separator can be any text or icon.">
            <ClassicBreadcrumb separator="->" />
          </Card>
          <Card
            title="Capsule"
            description="Connected rounded segments inspired by the reference style."
          >
            <CapsuleBreadcrumb />
          </Card>
          <Card title="Ribbon" description="Pointed segments with overlap and a closed final edge.">
            <RibbonBreadcrumb />
          </Card>
          <Card title="Parallelogram" description="Angled segments with shared overlap.">
            <ParallelogramBreadcrumb />
          </Card>
          <Card
            title="Ellipsis and dropdown trigger"
            description="Ellipsis is presentational; popup behavior stays with the caller."
          >
            <DropdownBreadcrumb />
          </Card>
        </div>
      </div>
    </main>
  )
}
