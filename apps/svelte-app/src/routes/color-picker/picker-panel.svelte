<script lang="ts">
  import { getColorChannelConfig,getColorChannelValue } from '@fex-design/core/color-picker/channels'
  import { parseColor } from '@fex-design/core/color/color'
  import type { ColorFormat } from '@fex-design/core/color/types'
  import { ColorPickerArea,ColorPickerAreaThumb,ColorPickerChannel,ColorPickerChannelThumb,ColorPickerChannelTrack,ColorPickerSwatch,useColorPicker } from '@fex-design/svelte/primitive/color-picker'
  import InputRoot from '@fex-design/svelte/primitive/input'
  import InputControl from '@fex-design/svelte/primitive/input-control'
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import SelectRoot from '@fex-design/svelte/primitive/select'
  import SelectTrigger from '@fex-design/svelte/primitive/select-trigger'
  import SelectContent from '@fex-design/svelte/primitive/select-content'
  let {alpha=true,clear=false,oklch=false}:{alpha?:boolean;clear?:boolean;oklch?:boolean}=$props()
  const picker=useColorPicker(),snapshot=$derived(picker.snapshot()),formats:ColorFormat[]=['hex','rgb','hsl','hsb','oklch'],options=formats.map(value=>({value,label:value.toUpperCase()}))
  const fields=$derived(snapshot.format==='rgb'?['red','green','blue']as const:snapshot.format==='hsl'?['hsl-hue','hsl-saturation','hsl-lightness']as const:snapshot.format==='hsb'?['hsb-hue','hsb-saturation','hsb-brightness']as const:snapshot.format==='oklch'?['oklch-lightness','oklch-chroma','oklch-hue']as const:[])
  let draft=$state(''),editing=$state(false)
  function edit(next:string){draft=next;const parsed=parseColor(next);if(parsed)picker.controller.setValue(parsed,'text-input')}
  function commit(){const parsed=parseColor(draft);if(parsed)picker.controller.setValue(parsed,'text-input',true);else draft=snapshot.value?.toHex()??'';editing=false}
</script>
<div class="grid w-80 max-w-full min-w-0 content-start gap-3">
  {#if clear}<div class="flex justify-end"><button type="button" aria-label="清除颜色" class="relative size-7 cursor-pointer overflow-hidden rounded-md border border-border bg-background after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-danger after:content-['']" onclick={()=>picker.controller.clear()}></button></div>{/if}
  <ColorPickerArea xChannel={oklch?'oklch-chroma':'hsb-saturation'} yChannel={oklch?'oklch-lightness':'hsb-brightness'}><ColorPickerAreaThumb/></ColorPickerArea>
  <ColorPickerChannel channel={oklch?'oklch-hue':'hsb-hue'}><ColorPickerChannelTrack><ColorPickerChannelThumb/></ColorPickerChannelTrack></ColorPickerChannel>
  {#if alpha}<div class="grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3"><ColorPickerChannel channel="alpha"><ColorPickerChannelTrack><ColorPickerChannelThumb/></ColorPickerChannelTrack></ColorPickerChannel><ColorPickerSwatch/></div>{/if}
  <SelectRoot {options} value={snapshot.format} onChange={format=>picker.controller.setFormat(format as ColorFormat)}><SelectTrigger/><SelectContent/></SelectRoot>
  <div class="flex min-w-0 items-center gap-2">{#if snapshot.format==='hex'}<div class="min-w-0 flex-1"><InputRoot value={editing?draft:snapshot.value?.toHex()??''} onValueChange={edit}><InputControl aria-label="颜色值" onfocus={()=>{draft=snapshot.value?.toHex()??'';editing=true;picker.controller.beginInteraction({source:'text-input'})}} onblur={commit} onkeydown={e=>e.key==='Enter'&&e.currentTarget.blur()}/></InputRoot></div>{:else}<div class="grid min-w-0 flex-1 grid-flow-col auto-cols-fr gap-2">{#each fields as channel}{@const config=getColorChannelConfig(channel)}<InputNumber class="min-w-0" min={config.min} max={config.max} step={config.step} value={snapshot.value?getColorChannelValue(snapshot.value,channel):undefined} onChange={(_,next)=>next!==undefined&&picker.controller.setChannel(channel,next,'field')} onblur={()=>picker.controller.completeInteraction()}/>{/each}</div>{/if}{#if alpha}<InputNumber class="w-20 shrink-0" value={Math.round((snapshot.value?.alpha??1)*100)} readonly>{#snippet suffix()}%{/snippet}</InputNumber>{/if}</div>
</div>
