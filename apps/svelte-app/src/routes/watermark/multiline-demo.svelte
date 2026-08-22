<script lang="ts">
  import Watermark from '@fex-design/svelte/primitive/watermark'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Multiline" description="Use an array to render multiple watermark lines.">
  <Watermark
    content={['FEX Admin', 'Confidential']}
    class="h-56 rounded-md border border-border bg-background"
  >
    <div class="grid h-full place-items-center p-space-xl text-center text-sm text-muted-foreground">
      Multiline text is drawn into the same repeated canvas tile.
    </div>
  </Watermark>
</Card>
