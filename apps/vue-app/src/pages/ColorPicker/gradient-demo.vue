<script setup lang="ts">
import type { LinearGradientInput } from '@fex-design/core/gradient/types'
import { formatLinearGradient } from '@fex-design/core/gradient/gradient'
import {
  ColorPickerRoot,
  GradientPickerRoot,
  GradientPickerStop,
  GradientPickerTrack,
} from '@fex-design/vue/primitive/color-picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@fex-design/vue/primitive/popover'
import Card from '@fex-design/vue/ui/card'
import PickerPanel from './picker-panel.vue'
const initial: LinearGradientInput = {
  type: 'linear-gradient',
  angle: 90,
  interpolation: 'oklch',
  stops: [
    { id: 'start', color: 'rgb(16 142 233)', position: 0 },
    { id: 'end', color: 'rgb(135 208 104)', position: 1 },
  ],
}
</script>
<template>
  <Card
    title="渐变色"
    description="选择色标后编辑当前颜色；点击轨道新增色标，拖动色标调整位置，使用 OKLCH 插值。"
    ><GradientPickerRoot v-slot="gradient" :default-value="initial"
      ><PopoverRoot
        ><PopoverTrigger v-slot="slot"
          ><button
            v-bind="slot.props"
            :ref="slot.ref"
            class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 text-sm"
          >
            <span
              class="size-6 shrink-0 rounded"
              :style="{ background: formatLinearGradient(gradient.snapshot.value) }"
            /><span class="truncate">{{
              gradient.snapshot.value.stops
                .map((stop) => `${stop.color.toString('rgb')} ${Math.round(stop.position * 100)}%`)
                .join(', ')
            }}</span>
          </button></PopoverTrigger
        ><PopoverPortal
          ><PopoverContent
            ><ColorPickerRoot
              default-format="rgb"
              :value="
                gradient.snapshot.value.stops.find(
                  (stop) => stop.id === gradient.snapshot.value.selectedStopId,
                )?.color ?? gradient.snapshot.value.stops[0]?.color
              "
              @change="
                value =>
                  value &&
                  gradient.controller.setStopColor(gradient.snapshot.value.selectedStopId, value)
              "
              ><div class="grid w-80 gap-3">
                <GradientPickerTrack v-slot="{ stops }"
                  ><GradientPickerStop
                    v-for="stop in stops"
                    :id="stop.id"
                    :key="stop.id" /></GradientPickerTrack
                ><PickerPanel /></div></ColorPickerRoot></PopoverContent></PopoverPortal></PopoverRoot></GradientPickerRoot
  ></Card>
</template>
