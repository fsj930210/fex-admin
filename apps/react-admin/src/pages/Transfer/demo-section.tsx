import { Card } from '@fex/components-react/ui/card'
import type { ReactNode } from 'react'

export function TransferDemoSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card title={title} description={description}>
      {children}
    </Card>
  )
}
