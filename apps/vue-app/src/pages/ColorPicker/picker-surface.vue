<script setup lang="ts">
import { ColorPickerSwatch, useColorPicker } from '@fex-design/vue/primitive/color-picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@fex-design/vue/primitive/popover'
import PickerPanel from './picker-panel.vue'
const props = withDefaults(
  defineProps<{
    alpha?: boolean
    clear?: boolean
    text?: boolean
    hover?: boolean
    inline?: boolean
    oklch?: boolean
  }>(),
  { alpha: true },
)
const picker = useColorPicker()
</script>
<template>
  <PickerPanel v-if="inline" :alpha="alpha" :clear="clear" :oklch="oklch" />
  <PopoverRoot v-else :trigger="hover ? ['hover'] : ['click']"
    ><PopoverTrigger v-slot="slot"
      ><button
        v-bind="slot.props"
        :ref="slot.ref"
        :disabled="picker.snapshot.value.disabled"
        :data-disabled="picker.snapshot.value.disabled || undefined"
        class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 data-disabled:cursor-not-allowed data-disabled:bg-muted-background data-disabled:opacity-50"
      >
        <ColorPickerSwatch /><span v-if="text" class="text-sm"
          >{{ picker.snapshot.value.format.toUpperCase() }}:
          {{
            picker.snapshot.value.value?.toString(picker.snapshot.value.format) ?? '未选择'
          }}</span
        >
      </button></PopoverTrigger
    ><PopoverPortal
      ><PopoverContent
        ><PickerPanel
          :alpha="alpha"
          :clear="clear"
          :oklch="oklch" /></PopoverContent></PopoverPortal
  ></PopoverRoot>
</template>
