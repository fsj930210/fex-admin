<script lang="ts">
  import { getColorChannelConfig } from '@fex-design/core/color-picker/channels'
  import { positionToValue } from '@fex-design/core/color-picker/coordinates'
  import type { ColorChannel } from '@fex-design/core/color-picker/types'
  import { colorPickerAreaClassName } from '@fex-design/styles/color-picker'
  import { cn } from '@fex/utils'
  import { getContext,setContext,type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { colorAreaKey,colorPickerKey,type ColorPickerContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>,'children'>{xChannel:ColorChannel;yChannel:ColorChannel;children?:Snippet}
  let {xChannel,yChannel,children,class:className,...rest}:Props=$props()
  let root:HTMLDivElement
  const picker=getContext<ColorPickerContext>(colorPickerKey)
  setContext(colorAreaKey,{x:()=>xChannel,y:()=>yChannel})
  const snapshot=$derived(picker.snapshot())
  const background=$derived(`linear-gradient(to top,black,transparent),linear-gradient(to right,white,transparent),${snapshot.value?.toString('oklch')??'transparent'}`)
  function update(event:PointerEvent){const rect=root.getBoundingClientRect(),x=Math.min(1,Math.max(0,(event.clientX-rect.left)/rect.width)),y=Math.min(1,Math.max(0,(event.clientY-rect.top)/rect.height)),xc=getColorChannelConfig(xChannel),yc=getColorChannelConfig(yChannel);picker.controller.setAreaChannels(xChannel,positionToValue(x,xc.min,xc.max),yChannel,positionToValue(y,yc.min,yc.max,true))}
</script>
<div {...rest} bind:this={root} data-disabled={snapshot.disabled||undefined} class={cn(colorPickerAreaClassName,className)} style:--color-picker-area-background={background} onpointerdown={(event)=>{if(snapshot.disabled)return;event.currentTarget.setPointerCapture(event.pointerId);picker.controller.beginInteraction({source:'area'});update(event)}} onpointermove={(event)=>event.currentTarget.hasPointerCapture(event.pointerId)&&update(event)} onpointerup={(event)=>{if(event.currentTarget.hasPointerCapture(event.pointerId)){event.currentTarget.releasePointerCapture(event.pointerId);picker.controller.completeInteraction()}}}>{@render children?.()}</div>
