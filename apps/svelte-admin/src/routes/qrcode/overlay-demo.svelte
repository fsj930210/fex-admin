<script lang="ts">
  import { QrCodeBackground, QrCodeModules, QrCodeOverlay, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  let expired = $state(true)
</script>

<Card title="Overlay" description="Overlay 不参与二维码生成，可组合加载、失效和自定义操作状态。">
  <div class="flex flex-wrap items-center gap-space-md">
    <QrCodeRoot value="https://fex.design/overlay" size={176}>
      <QrCodeSvg>
        <QrCodeBackground />
        <QrCodeModules />
      </QrCodeSvg>
      {#if expired}
        <QrCodeOverlay>
          <Button size="sm" onclick={() => (expired = false)}>Refresh</Button>
        </QrCodeOverlay>
      {/if}
    </QrCodeRoot>
    <Button variant="outline" onclick={() => (expired = !expired)}>Toggle overlay</Button>
  </div>
</Card>
