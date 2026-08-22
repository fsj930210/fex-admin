<script setup lang="ts">
import { ColorPickerRoot, ColorPickerSwatch } from '@fex-design/vue/primitive/color-picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@fex-design/vue/primitive/popover'
import { ChevronDownIcon } from '@fex-design/vue/icon/chevron'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import PickerPanel from './picker-panel.vue'
const groups = [
  [
    'primary',
    [
      '#E6F4FF',
      '#91CAFF',
      '#69B1FF',
      '#4096FF',
      '#1677FF',
      '#0958D9',
      '#003EB3',
      '#002C8C',
      '#001D66',
    ],
  ],
  [
    'red',
    [
      '#FFF1F0',
      '#FFCCC7',
      '#FFA39E',
      '#FF7875',
      '#FF4D4F',
      '#F5222D',
      '#CF1322',
      '#A8071A',
      '#820014',
    ],
  ],
  [
    'green',
    [
      '#F6FFED',
      '#D9F7BE',
      '#B7EB8F',
      '#95DE64',
      '#73D13D',
      '#52C41A',
      '#389E0D',
      '#237804',
      '#135200',
    ],
  ],
  [
    'cyan',
    [
      '#E6FFFB',
      '#B5F5EC',
      '#87E8DE',
      '#5CDBD3',
      '#36CFC9',
      '#13C2C2',
      '#08979C',
      '#006D75',
      '#00474F',
    ],
  ],
] as const
const value = ref('#1677FF')
</script>
<template>
  <Card
    title="预设颜色"
    description="打开面板后，可从预设分组选择颜色，也可使用右侧完整选择器编辑。"
    ><ColorPickerRoot
      :value="value"
      @change="next => (value = next?.toString('oklch') ?? value)"
      ><PopoverRoot placement="bottomLeft"
        ><PopoverTrigger v-slot="slot"
          ><button
            v-bind="slot.props"
            :ref="slot.ref"
            class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2"
          >
            <ColorPickerSwatch /></button></PopoverTrigger
        ><PopoverPortal
          ><PopoverContent
            class="w-max max-w-[calc(100vw-24px)] overflow-visible [--popover-content-max-width:calc(100vw-24px)]"
            ><div class="grid min-w-0 gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]">
              <div
                class="grid min-w-0 content-start gap-3 border-b border-border pb-3 sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0"
              >
                <section v-for="[label, colors] in groups" :key="label">
                  <button
                    type="button"
                    class="mb-2 flex h-5 cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                  >
                    <ChevronDownIcon class="size-3" /><span>{{ label }}</span>
                  </button>
                  <div class="grid w-max grid-cols-7 gap-2">
                    <button
                      v-for="color in colors"
                      :key="color"
                      class="size-6 cursor-pointer rounded border border-border"
                      :style="{ background: color }"
                      :aria-label="color"
                      @click="value = color"
                    />
                  </div>
                </section>
              </div>
              <PickerPanel /></div></PopoverContent></PopoverPortal></PopoverRoot></ColorPickerRoot
  ></Card>
</template>
