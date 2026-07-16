import { Card } from '@fex/components-solid/ui/card'
import type { ParentProps } from 'solid-js'

export function DataGridDemoSection(props: ParentProps<{ title: string; description: string }>) {
  return (
    <Card title={props.title} description={props.description}>
      {props.children}
    </Card>
  )
}

export function DemoBranch(props: ParentProps<{ title: string }>) {
  return (
    <section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">{props.title}</h3>
      {props.children}
    </section>
  )
}
