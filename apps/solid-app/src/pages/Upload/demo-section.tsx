import { Card } from '@fex-design/solid/ui/card'
import type { ParentProps } from 'solid-js'
export function UploadDemoSection(props: ParentProps<{ title: string; description: string }>) {
  return (
    <Card title={props.title} description={props.description}>
      {props.children}
    </Card>
  )
}
