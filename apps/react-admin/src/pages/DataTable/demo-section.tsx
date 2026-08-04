import { Card } from '@fex-design/react/ui/card'
import type { ReactNode } from 'react'

export function DataTableDemoSection({
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

export function DemoBranch({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-space-sm">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {children}
    </section>
  )
}
