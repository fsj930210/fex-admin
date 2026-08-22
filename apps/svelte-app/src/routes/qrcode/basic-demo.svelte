<script lang="ts">
  import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="基本使用" description="使用 SVG 部件渲染最基础的二维码。">
  <QrCodeRoot value="https://fex.design/components/qrcode" size={176} margin={4} errorLevel="M">
    <QrCodeSvg aria-label="Fex Design QR code">
      <QrCodeBackground />
      <QrCodeModules />
    </QrCodeSvg>
  </QrCodeRoot>
</Card>
