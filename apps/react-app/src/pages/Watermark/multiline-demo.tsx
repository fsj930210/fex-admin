import { Watermark } from '@fex-design/react/primitive/watermark'
import { Card } from '@fex-design/react/ui/card'

export function MultilineDemo() {
  return (
    <Card title="Multiline" description="Use an array to render multiple text lines.">
      <Watermark
        content={['FEX Admin', 'Confidential']}
        className="h-56 rounded-md border border-border bg-background"
      >
        <div className="grid h-full place-items-center p-space-xl text-center text-sm text-muted-foreground">
          Multiple lines stay centered inside every repeated tile.
        </div>
      </Watermark>
    </Card>
  )
}
