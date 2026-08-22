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

<Card
  title="带 Icon 的例子"
  description="通过 Center 放置小 Logo，Modules 只为 Logo 背板留出必要空间。"
>
  <QrCodeRoot value="https://fex.design/qrcode/icon" size={176} errorLevel="H">
    <QrCodeSvg>
      <QrCodeBackground />
      <QrCodeModules centerSize={44} />
      <QrCodeCenter size={44} aria-label="Fex Design">
        <circle cx="50" cy="50" r="48" class="fill-background stroke-border" stroke-width="2"></circle>
        <text
          x="50"
          y="52"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="28"
          class="fill-foreground font-semibold"
        >
          FEX
        </text>
      </QrCodeCenter>
    </QrCodeSvg>
  </QrCodeRoot>
</Card>
