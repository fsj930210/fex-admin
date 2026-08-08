<script lang="ts">
  import Watermark from '@fex-design/svelte/primitive/watermark'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  function removeWatermark() {
    document.querySelector('[data-demo="svelte-watermark-restore"] [data-slot="watermark"]')?.remove()
  }
</script>

<Card title="Restore" description="Removing the generated watermark layer appends it back.">
  <div class="space-y-space-md">
    <Button variant="outline" onclick={removeWatermark}>Remove generated layer</Button>
    <Watermark
      content={['FEX Admin', 'Do not distribute']}
      data-demo="svelte-watermark-restore"
      class="h-56 rounded-md border border-border bg-background"
    >
      <div class="grid h-full place-items-center p-space-xl text-center text-sm text-muted-foreground">
        The controller observes direct child removal on this root and restores the layer.
      </div>
    </Watermark>
  </div>
</Card>
