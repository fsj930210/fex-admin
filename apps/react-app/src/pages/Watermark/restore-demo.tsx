import { Watermark } from '@fex-design/react/primitive/watermark'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function RestoreDemo() {
  const removeWatermark = () => {
    document.querySelector('[data-demo="react-watermark-restore"] [data-slot="watermark"]')?.remove()
  }

  return (
    <Card title="Restore" description="Removing the generated watermark layer appends it back.">
      <div className="space-y-space-md">
        <Button variant="outline" onClick={removeWatermark}>
          Remove generated layer
        </Button>
        <Watermark
          content={['FEX Admin', 'Do not distribute']}
          data-demo="react-watermark-restore"
          className="h-56 rounded-md border border-border bg-background"
        >
          <div className="grid h-full place-items-center p-space-xl text-center text-sm text-muted-foreground">
            The controller observes direct child removal on this root and restores the layer.
          </div>
        </Watermark>
      </div>
    </Card>
  )
}
