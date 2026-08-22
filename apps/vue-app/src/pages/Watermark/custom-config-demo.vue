<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { InputControl, InputRoot } from '@fex-design/vue/primitive/input'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@fex-design/vue/primitive/slider'
import { Watermark } from '@fex-design/vue/primitive/watermark'
import Card from '@fex-design/vue/ui/card'

const content = ref('FEX Admin')
const color = ref('rgba(0, 0, 0, 0.15)')
const fontSize = ref(18)
const zIndex = ref(9)
const rotate = ref(-22)
const gapX = ref(100)
const gapY = ref(100)
const offsetX = ref(0)
const offsetY = ref(0)

const font = computed(() => ({ color: color.value, fontSize: fontSize.value }))
const gap = computed<[number, number]>(() => [gapX.value, gapY.value])
const offset = computed<[number, number]>(() => [offsetX.value, offsetY.value])

function setNumber(target: Ref<number>, value: string) {
  target.value = Number(value) || 0
}
</script>

<template>
  <Card
    title="Custom Config"
    description="Adjust content, font, layering, rotation, gap, and offset."
  >
    <div class="grid gap-space-xl lg:grid-cols-[280px_minmax(0,1fr)]">
      <div class="grid gap-space-lg">
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Content</span>
          <InputRoot :value="content" @value-change="content = $event">
            <InputControl aria-label="Watermark content" />
          </InputRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Color</span>
          <InputRoot :value="color" @value-change="color = $event">
            <InputControl aria-label="Watermark color" />
          </InputRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>FontSize: {{ fontSize }}</span>
          <SliderRoot
            :value="[fontSize]"
            :min="12"
            :max="42"
            aria-label="FontSize"
            @value-change="fontSize = $event[0] ?? fontSize"
          >
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb aria-label="FontSize" />
          </SliderRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>ZIndex: {{ zIndex }}</span>
          <SliderRoot
            :value="[zIndex]"
            :min="1"
            :max="20"
            aria-label="ZIndex"
            @value-change="zIndex = $event[0] ?? zIndex"
          >
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb aria-label="ZIndex" />
          </SliderRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Rotate: {{ rotate }}</span>
          <SliderRoot
            :value="[rotate]"
            :min="-45"
            :max="45"
            aria-label="Rotate"
            @value-change="rotate = $event[0] ?? rotate"
          >
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb aria-label="Rotate" />
          </SliderRoot>
        </label>
        <div class="grid grid-cols-2 gap-space-sm">
          <label class="grid gap-space-sm text-sm text-foreground">
            <span>Gap X</span>
            <InputRoot :value="String(gapX)" @value-change="setNumber(gapX, $event)">
              <InputControl inputmode="numeric" aria-label="Gap X" />
            </InputRoot>
          </label>
          <label class="grid gap-space-sm text-sm text-foreground">
            <span>Gap Y</span>
            <InputRoot :value="String(gapY)" @value-change="setNumber(gapY, $event)">
              <InputControl inputmode="numeric" aria-label="Gap Y" />
            </InputRoot>
          </label>
          <label class="grid gap-space-sm text-sm text-foreground">
            <span>Offset X</span>
            <InputRoot :value="String(offsetX)" @value-change="setNumber(offsetX, $event)">
              <InputControl inputmode="numeric" aria-label="Offset X" />
            </InputRoot>
          </label>
          <label class="grid gap-space-sm text-sm text-foreground">
            <span>Offset Y</span>
            <InputRoot :value="String(offsetY)" @value-change="setNumber(offsetY, $event)">
              <InputControl inputmode="numeric" aria-label="Offset Y" />
            </InputRoot>
          </label>
        </div>
      </div>
      <Watermark
        :content="content"
        :font="font"
        :z-index="zIndex"
        :rotate="rotate"
        :gap="gap"
        :offset="offset"
        class="min-h-96 rounded-md border border-border bg-background"
      >
        <div class="grid min-h-96 place-items-center p-space-xl text-center text-sm text-muted-foreground">
          Config changes update the generated canvas tile.
        </div>
      </Watermark>
    </div>
  </Card>
</template>
