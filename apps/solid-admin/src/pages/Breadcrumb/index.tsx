import { A } from '@solidjs/router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage as CurrentPage,
  BreadcrumbSeparator,
} from '@fex-design/solid/primitive/breadcrumb'
import { Card } from '@fex-design/solid/ui/card'
import type { JSX } from 'solid-js'
import { BreadcrumbDropdownDemo } from './dropdown-demo'
import { ClassicBreadcrumb } from './classic-breadcrumb'
import { CapsuleBreadcrumb } from './capsule-breadcrumb'
import { RibbonBreadcrumb } from './ribbon-breadcrumb'
import { ParallelogramBreadcrumb } from './parallelogram-breadcrumb'

export function BreadcrumbPage(): JSX.Element {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header>
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <h1 class="mt-space-md text-2xl font-semibold text-foreground">Breadcrumb</h1>
          <p class="mt-space-md text-sm text-muted-foreground">
            Composable navigation trails with links, current pages, custom separators and menu
            triggers.
          </p>
        </header>
        <div class="space-y-space-xl">
          <Card title="Classic" description="Links and the current page use different semantics.">
            <ClassicBreadcrumb />
          </Card>
          <Card title="Custom separator" description="The separator can be any text or icon.">
            <ClassicBreadcrumb separator="-&gt;" />
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbDropdownDemo />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <CurrentPage>Quarterly plan</CurrentPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Card>
        </div>
      </div>
    </main>
  )
}
