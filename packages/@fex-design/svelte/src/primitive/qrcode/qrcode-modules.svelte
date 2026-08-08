<script lang="ts">
  import {
    getQrCodeCenterExcludeRect,
    getQrCodeSvgPath,
    type QrCodeModuleExcludeRect,
  } from '@fex-design/core/qrcode'
  import { qrcodeModulesClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import type { SVGAttributes } from 'svelte/elements'
  import { useQrCode } from './context'

  interface Props extends Omit<SVGAttributes<SVGPathElement>, 'class'> {
    centerSize?: number
    exclude?: QrCodeModuleExcludeRect
    class?: string
  }

  let { centerSize, exclude, class: className, ...rest }: Props = $props()
  const { getModel } = useQrCode('QrCodeModules')
  const model = $derived(getModel())
  const classList = $derived(cn(qrcodeModulesClassName, className))
  const path = $derived.by(() => {
    const centerExclude = centerSize ? getQrCodeCenterExcludeRect(model, centerSize) : undefined
    return getQrCodeSvgPath(model, exclude ?? centerExclude)
  })
</script>

<path {...rest} data-slot="qrcode-modules" class={classList} d={path} />
