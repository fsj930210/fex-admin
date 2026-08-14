<script lang="ts">
  import { getColorChannelConfig,getColorChannelValue } from '@fex-design/core/color-picker/channels'
  import { valueToPosition } from '@fex-design/core/color-picker/coordinates'
  import { colorPickerAreaThumbClassName } from '@fex-design/styles/color-picker'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { colorAreaKey,colorPickerKey,type ColorAreaContext,type ColorPickerContext } from './context'
  let {class:className,...rest}:HTMLAttributes<HTMLSpanElement>=$props()
  const picker=getContext<ColorPickerContext>(colorPickerKey),area=getContext<ColorAreaContext>(colorAreaKey)
  const value=$derived(picker.snapshot().value)
  const left=$derived(value?valueToPosition(getColorChannelValue(value,area.x()),getColorChannelConfig(area.x()).min,getColorChannelConfig(area.x()).max)*100:0)
  const top=$derived(value?valueToPosition(getColorChannelValue(value,area.y()),getColorChannelConfig(area.y()).min,getColorChannelConfig(area.y()).max,true)*100:0)
</script>
<span {...rest} class={cn(colorPickerAreaThumbClassName,className)} style:left={`${left}%`} style:top={`${top}%`} style:background={value?.toString('rgb')} />
