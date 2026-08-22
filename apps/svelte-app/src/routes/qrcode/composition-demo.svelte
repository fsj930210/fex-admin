<script lang="ts">
  import {
    QrCodeBackground,
    QrCodeCenter,
    QrCodeModules,
    QrCodeRoot,
    QrCodeSvg,
  } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Composition" description="Modules 和 Center 可以独立组合，中心内容由调用方决定。">
  <QrCodeRoot
    value="https://fex.design/composition"
    size={176}
    errorLevel="H"
    class="bg-muted-background"
  >
    <QrCodeSvg>
      <QrCodeBackground />
      <QrCodeModules centerSize={40} />
      <QrCodeCenter size={40} aria-label="Fex Design">
        <rect width="100" height="100" rx="20" class="fill-background"></rect>
        <text
          x="50"
          y="52"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="30"
          class="fill-primary font-semibold"
        >
          FX
        </text>
      </QrCodeCenter>
    </QrCodeSvg>
  </QrCodeRoot>
</Card>
