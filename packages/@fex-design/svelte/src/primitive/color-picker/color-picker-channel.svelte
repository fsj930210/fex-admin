<script lang="ts">
  import { getColorChannelConfig } from '@fex-design/core/color-picker/channels'
  import { positionToValue } from '@fex-design/core/color-picker/coordinates'
  import type { ColorChannel } from '@fex-design/core/color-picker/types'
  import { colorPickerChannelClassName } from '@fex-design/styles/color-picker'
  import { cn } from '@fex/utils'
  import { getContext,setContext,type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { colorChannelKey,colorPickerKey,type ColorPickerContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>,'children'>{channel:ColorChannel;orientation?:'horizontal'|'vertical';children?:Snippet}
  let {channel,orientation='horizontal',children,class:className,...rest}:Props=$props()
  let root:HTMLDivElement
  const picker=getContext<ColorPickerContext>(colorPickerKey)
  setContext(colorChannelKey,()=>channel)
  const snapshot=$derived(picker.snapshot())
  const background=$derived(channel.endsWith('hue')?'linear-gradient(to right,red,#ff0,lime,cyan,blue,#f0f,red)':channel==='alpha'?'linear-gradient(to right,transparent,'+(snapshot.value?.toString('rgb')??'transparent')+')':snapshot.value?.toString('rgb'))
  function update(event:PointerEvent){const rect=root.getBoundingClientRect(),position=orientation==='vertical'?1-(event.clientY-rect.top)/rect.height:(event.clientX-rect.left)/rect.width,config=getColorChannelConfig(channel);picker.controller.setChannel(channel,positionToValue(Math.min(1,Math.max(0,position)),config.min,config.max))}
</script>
<div {...rest} bind:this={root} data-disabled={snapshot.disabled||undefined} data-orientation={orientation} class={cn(colorPickerChannelClassName,className)} style:--color-picker-channel-background={background} onpointerdown={(event)=>{if(snapshot.disabled)return;event.currentTarget.setPointerCapture(event.pointerId);picker.controller.beginInteraction({source:'channel'});update(event)}} onpointermove={(event)=>event.currentTarget.hasPointerCapture(event.pointerId)&&update(event)} onpointerup={(event)=>{if(event.currentTarget.hasPointerCapture(event.pointerId)){event.currentTarget.releasePointerCapture(event.pointerId);picker.controller.completeInteraction()}}}>{@render children?.()}</div>
