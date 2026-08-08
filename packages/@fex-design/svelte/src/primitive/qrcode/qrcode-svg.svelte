<script lang="ts">
  import { qrcodeSurfaceClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'
  import { useQrCode } from './context'

  interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let {
    class: className,
    children,
    role = 'img',
    'aria-label': ariaLabel = 'QR code',
    ...rest
  }: Props = $props()
  const { getModel } = useQrCode('QrCodeSvg')
  const model = $derived(getModel())
  const classList = $derived(cn(qrcodeSurfaceClassName, className))
  const viewBox = $derived('0 0 ' + model.viewBoxSize + ' ' + model.viewBoxSize)
</script>

<svg
  {...rest}
  {role}
  aria-label={ariaLabel}
  data-slot="qrcode-svg"
  class={classList}
  {viewBox}
  width={model.size}
  height={model.size}
  shape-rendering="crispEdges"
  xmlns="http://www.w3.org/2000/svg"
>
  {@render children?.()}
</svg>
