<script setup lang="ts">
import { getColorChannelConfig,getColorChannelValue } from '@fex-design/core/color-picker/channels'
import { parseColor } from '@fex-design/core/color/color'
import type { ColorFormat } from '@fex-design/core/color/types'
import { ColorPickerArea,ColorPickerAreaThumb,ColorPickerChannel,ColorPickerChannelThumb,ColorPickerChannelTrack,ColorPickerSwatch,useColorPicker } from '@fex-design/vue/primitive/color-picker'
import { InputControl,InputRoot } from '@fex-design/vue/primitive/input'
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import { SelectContent,SelectRoot,SelectTrigger } from '@fex-design/vue/primitive/select'
import { computed,ref } from 'vue'
const props=withDefaults(defineProps<{alpha?:boolean;clear?:boolean;oklch?:boolean}>(),{alpha:true})
const picker=useColorPicker(),editing=ref(false),draft=ref('')
const formats:ColorFormat[]=['hex','rgb','hsl','hsb','oklch']
const options=formats.map(value=>({value,label:value.toUpperCase()}))
const value=computed(()=>picker.snapshot.value.value)
const text=computed(()=>value.value?.toHex()??'')
const fields=computed(()=>picker.snapshot.value.format==='rgb'?['red','green','blue']as const:picker.snapshot.value.format==='hsl'?['hsl-hue','hsl-saturation','hsl-lightness']as const:picker.snapshot.value.format==='hsb'?['hsb-hue','hsb-saturation','hsb-brightness']as const:picker.snapshot.value.format==='oklch'?['oklch-lightness','oklch-chroma','oklch-hue']as const:[])
function edit(next:string){draft.value=next;const parsed=parseColor(next);if(parsed)picker.controller.setValue(parsed,'text-input')}
function commit(){const parsed=parseColor(draft.value);if(parsed)picker.controller.setValue(parsed,'text-input',true);else draft.value=text.value;editing.value=false}
</script>
<template>
  <div class="grid w-80 max-w-full min-w-0 content-start gap-3">
    <div v-if="clear" class="flex justify-end"><button type="button" aria-label="清除颜色" class="relative size-7 cursor-pointer overflow-hidden rounded-md border border-border bg-background after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-danger after:content-['']" @click="picker.controller.clear()"/></div>
    <ColorPickerArea :x-channel="oklch?'oklch-chroma':'hsb-saturation'" :y-channel="oklch?'oklch-lightness':'hsb-brightness'"><ColorPickerAreaThumb/></ColorPickerArea>
    <ColorPickerChannel :channel="oklch?'oklch-hue':'hsb-hue'"><ColorPickerChannelTrack/><ColorPickerChannelThumb/></ColorPickerChannel>
    <div v-if="alpha" class="grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3"><ColorPickerChannel channel="alpha"><ColorPickerChannelTrack/><ColorPickerChannelThumb/></ColorPickerChannel><ColorPickerSwatch/></div>
    <SelectRoot :options="options" :value="picker.snapshot.value.format" @change="format=>picker.controller.setFormat(format as ColorFormat)"><SelectTrigger/><SelectContent/></SelectRoot>
    <div class="flex min-w-0 items-center gap-2">
      <div v-if="picker.snapshot.value.format==='hex'" class="min-w-0 flex-1"><InputRoot :value="editing?draft:text" @value-change="edit"><InputControl aria-label="颜色值" @focus="draft=text;editing=true;picker.controller.beginInteraction({source:'text-input'})" @blur="commit" @keydown.enter="($event.target as HTMLInputElement).blur()"/></InputRoot></div>
      <div v-else class="grid min-w-0 flex-1 grid-flow-col auto-cols-fr gap-2"><InputNumber v-for="channel in fields" :key="channel" class="min-w-0" :min="getColorChannelConfig(channel).min" :max="getColorChannelConfig(channel).max" :step="getColorChannelConfig(channel).step" :value="value?getColorChannelValue(value,channel):undefined" @change="(_,next)=>next!==undefined&&picker.controller.setChannel(channel,next,'field')" @blur="picker.controller.completeInteraction()"/></div>
      <InputNumber v-if="alpha" class="w-20 shrink-0" :value="Math.round((value?.alpha??1)*100)" suffix="%" readonly/>
    </div>
  </div>
</template>
