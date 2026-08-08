<script lang="ts">
  import { QrCodeBackground, QrCodeModules, QrCodeOverlay, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  let expired = $state(true)
</script>

<Card title="自定义状态渲染器" description="调用方完全控制遮罩内容、按钮和状态切换逻辑。">
  <div class="flex flex-wrap items-center gap-space-md">
    <QrCodeRoot value="https://fex.design/qrcode/custom-status" size={176}>
      <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
      {#if expired}
        <QrCodeOverlay>
          <div class="grid gap-space-xs">
            <span class="text-sm font-medium">二维码已过期</span>
            <Button size="sm" onclick={() => (expired = false)}>重新加载</Button>
          </div>
        </QrCodeOverlay>
      {/if}
    </QrCodeRoot>
    <Button variant="outline" onclick={() => (expired = !expired)}>切换状态</Button>
  </div>
</Card>
