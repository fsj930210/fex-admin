<script lang="ts">
  import type { QrCodeErrorLevel } from '@fex-design/core/qrcode'
  import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/svelte/primitive/qrcode'
  import Card from '@fex-design/svelte/ui/card'

  const levels: QrCodeErrorLevel[] = ['L', 'M', 'Q', 'H']
</script>

<Card title="纠错比例" description="errorLevel 透传给编码层，适合 Logo 或污损容错场景。">
  <div class="flex flex-wrap gap-space-lg">
    {#each levels as level (level)}
      <div class="grid gap-space-xs text-center text-sm text-muted-foreground">
        <QrCodeRoot value={'https://fex.design/qrcode/error/' + level} size={128} errorLevel={level}>
          <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
        </QrCodeRoot>
        <span>{level}</span>
      </div>
    {/each}
  </div>
</Card>
