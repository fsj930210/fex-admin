<script lang="ts">
  import { createQrCodeModel, type QrCodeErrorLevel } from '@fex-design/core/qrcode'
  import { qrcodeRootClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import { setContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { qrcodeContextKey, type QrCodeContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'color'> {
    value: string
    errorLevel?: QrCodeErrorLevel
    margin?: number
    size?: number
    color?: string
    bgColor?: string
    class?: string
    children?: Snippet
  }

  let {
    value,
    errorLevel = 'M',
    margin = 4,
    size = 160,
    color = '#000000',
    bgColor = '#ffffff',
    class: className,
    style,
    children,
    ...rest
  }: Props = $props()

  const model = $derived(createQrCodeModel({ value, errorLevel, margin, size, color, bgColor }))
  const classList = $derived(cn(qrcodeRootClassName, className))
  const rootStyle = $derived(
    'width:' +
      model.size +
      'px;height:' +
      model.size +
      'px;--qrcode-size:' +
      model.size +
      'px;--qrcode-color:' +
      model.color +
      ';--qrcode-bg-color:' +
      model.bgColor +
      ';' +
      (style ?? ''),
  )

  setContext<QrCodeContext>(qrcodeContextKey, { getModel: () => model })
</script>

<div {...rest} data-slot="qrcode" class={classList} style={rootStyle}>
  {@render children?.()}
</div>
