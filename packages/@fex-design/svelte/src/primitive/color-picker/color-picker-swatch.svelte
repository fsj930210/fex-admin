<script lang="ts">
  import { colorPickerSwatchClassName } from '@fex-design/styles/color-picker'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { colorPickerKey,type ColorPickerContext } from './context'
  interface Props extends HTMLAttributes<HTMLSpanElement>{color?:string}
  let {color,class:className,...rest}:Props=$props()
  const picker=getContext<ColorPickerContext>(colorPickerKey),snapshot=$derived(picker.snapshot()),value=$derived(color??snapshot.value?.toString('rgb')??'transparent')
</script>
<span {...rest} data-empty={!snapshot.value||undefined} class={cn(colorPickerSwatchClassName,className)} style:--color-picker-color={value} />
