<script lang="ts">
  import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="自定义颜色" description="color 和 bgColor 进入 core 模型，再由渲染部件消费。">
  <div class="flex flex-wrap gap-space-lg">
    <QrCodeRoot value="https://fex.design/qrcode/blue" size={160} color="#075985" bgColor="#f0f9ff">
      <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
    </QrCodeRoot>
    <QrCodeRoot value="https://fex.design/qrcode/green" size={160} color="#166534" bgColor="#f0fdf4">
      <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
    </QrCodeRoot>
  </div>
</Card>
