import { Card } from '@fex/components-react/ui/card'
import type { ReactNode } from 'react'

export function SelectDemoSection(props: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card title={props.title} description={props.description}>
      <div className="max-w-md">{props.children}</div>
    </Card>
  )
}
