<script lang="ts">
  import { getQrCodeCenterRect } from '@fex-design/core/qrcode'
  import { qrcodeCenterClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'
  import { useQrCode } from './context'

  interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'class'> {
    size?: number
    class?: string
    children?: Snippet
  }

  let { size = 40, class: className, style, children, ...rest }: Props = $props()
  const { getModel } = useQrCode('QrCodeCenter')
  const rect = $derived(getQrCodeCenterRect(getModel(), size))
  const classList = $derived(cn(qrcodeCenterClassName, className))
</script>

<svg
  {...rest}
  data-slot="qrcode-center"
  class={classList}
  {style}
  x={rect.x}
  y={rect.y}
  width={rect.width}
  height={rect.height}
  viewBox="0 0 100 100"
  overflow="visible"
>
  {@render children?.()}
</svg>
