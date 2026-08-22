<script lang="ts">
  import { QrCodeCanvas, QrCodeRoot } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Canvas" description="Canvas renderer 适合需要像素绘制或后续导出的场景。">
  <QrCodeRoot
    value="https://fex.design/canvas"
    size={176}
    color="#075985"
    bgColor="#f0f9ff"
  >
    <QrCodeCanvas aria-label="Canvas QR code" />
  </QrCodeRoot>
</Card>
