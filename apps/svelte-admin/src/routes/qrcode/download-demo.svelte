<script lang="ts">
  import { QrCodeCanvas, QrCodeRoot } from '@fex-design/svelte/primitive/qrcode'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  let container: HTMLDivElement | undefined

  function download() {
    const canvas = container?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'fex-qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
</script>

<Card title="下载二维码" description="下载不是 QRCode 内置能力，这里演示业务侧基于 Canvas 组合导出 PNG。">
  <div bind:this={container} class="flex flex-wrap items-center gap-space-md">
    <QrCodeRoot value="https://fex.design/qrcode/download" size={176}>
      <QrCodeCanvas aria-label="Downloadable QR code" />
    </QrCodeRoot>
    <Button onclick={download}>下载 PNG</Button>
  </div>
</Card>
