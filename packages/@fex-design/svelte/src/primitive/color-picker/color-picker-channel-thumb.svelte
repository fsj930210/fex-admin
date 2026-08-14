<script lang="ts">
  import { getColorChannelConfig,getColorChannelValue } from '@fex-design/core/color-picker/channels'
  import { valueToPosition } from '@fex-design/core/color-picker/coordinates'
  import type { ColorChannel } from '@fex-design/core/color-picker/types'
  import { colorPickerChannelThumbClassName } from '@fex-design/styles/color-picker'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { colorChannelKey,colorPickerKey,type ColorPickerContext } from './context'
  let {class:className,...rest}:HTMLAttributes<HTMLSpanElement>=$props()
  const picker=getContext<ColorPickerContext>(colorPickerKey),channel=getContext<()=>ColorChannel>(colorChannelKey)
  const value=$derived(picker.snapshot().value)
  const position=$derived(value?valueToPosition(getColorChannelValue(value,channel()),getColorChannelConfig(channel()).min,getColorChannelConfig(channel()).max)*100:0)
</script>
<span {...rest} class={cn(colorPickerChannelThumbClassName,className)} style:left={`clamp(6px, ${position}%, calc(100% - 6px))`} style:top="50%" style:transform="translate(-50%,-50%)" />
