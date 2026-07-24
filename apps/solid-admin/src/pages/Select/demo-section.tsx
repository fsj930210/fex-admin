import { Card } from '@fex/components-solid/ui/card'
import type { ParentProps } from 'solid-js'
export function SelectDemoSection(props: ParentProps<{ title: string; description: string }>) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="max-w-md">{props.children}</div>
    </Card>
  )
}
