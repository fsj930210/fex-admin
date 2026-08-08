<script lang="ts">
  import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'

  const sizes = [96, 128, 176]
</script>

<Card title="自定义尺寸" description="通过 Root 的 size 控制二维码输出尺寸。">
  <div class="flex flex-wrap items-end gap-space-lg">
    {#each sizes as size (size)}
      <QrCodeRoot value={'https://fex.design/qrcode/size/' + size} {size}>
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
      </QrCodeRoot>
    {/each}
  </div>
</Card>
