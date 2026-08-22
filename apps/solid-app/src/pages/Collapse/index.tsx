import { A } from '@solidjs/router'
import { AccordionCollapseDemo } from './accordion-demo'
import { BasicCollapseDemo } from './basic-demo'
import { ControlledCollapseDemo } from './controlled-demo'
import { CustomCollapseDemo } from './custom-demo'
import { NestedCollapseDemo } from './nested-demo'
import { RefCollapseDemo } from './ref-demo'
import { VariantCollapseDemo } from './variant-demo'

export function CollapsePage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-sm">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Collapse</h1>
            <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
              Composable disclosure panels with multiple mode, accordion mode, controlled state,
              instance methods and complete custom rendering.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <BasicCollapseDemo />
          <AccordionCollapseDemo />
          <ControlledCollapseDemo />
          <RefCollapseDemo />
          <CustomCollapseDemo />
          <VariantCollapseDemo />
          <NestedCollapseDemo />
        </div>
      </div>
    </main>
  )
}
