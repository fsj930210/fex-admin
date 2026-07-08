<script setup lang="ts">
import { ref } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '@fex/components-vue/primitive/slider'
import Card from '@fex/components-vue/ui/card'

const basicValue = ref([32])
const controlledValue = ref([48])
const rangeValue = ref([20, 80])
const multipleValue = ref([15, 45, 75])
const disabledValue = ref([60])

function setBasicValue(next: number[]) {
  basicValue.value = next
}

function setControlledValue(next: number[]) {
  controlledValue.value = next
}

function setRangeValue(next: number[]) {
  rangeValue.value = next
}

function setMultipleValue(next: number[]) {
  multipleValue.value = next
}
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Slider</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Primitive slider with shared core value logic.</p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <Card title="Basic" description="Uncontrolled slider uses defaultValue.">
          <div class="grid gap-space-sm">
            <SliderRoot :default-value="[32]" aria-label="Volume" @value-change="setBasicValue">
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb aria-label="Volume" />
            </SliderRoot>
            <p class="text-sm text-muted-foreground">Current value: {{ basicValue.join(', ') }}</p>
          </div>
        </Card>
        <Card title="Controlled" description="Controlled slider uses value and valueChange.">
          <div class="grid gap-space-sm">
            <SliderRoot :value="controlledValue" aria-label="Controlled slider" @value-change="setControlledValue">
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb aria-label="Controlled slider" />
            </SliderRoot>
            <p class="text-sm text-muted-foreground">Current value: {{ controlledValue.join(', ') }}</p>
          </div>
        </Card>
        <Card title="Range" description="Use an array with two values for a range slider.">
          <div class="grid gap-space-sm">
            <SliderRoot :default-value="[20, 80]" :min-steps-between-thumbs="4" aria-label="Range slider" @value-change="setRangeValue">
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb :index="0" aria-label="Minimum value" />
              <SliderThumb :index="1" aria-label="Maximum value" />
            </SliderRoot>
            <p class="text-sm text-muted-foreground">Current value: {{ rangeValue.join(', ') }}</p>
          </div>
        </Card>
        <Card title="Multiple Thumbs" description="Use more than two values to create multiple thumbs.">
          <div class="grid gap-space-sm">
            <SliderRoot :default-value="[15, 45, 75]" :min-steps-between-thumbs="4" aria-label="Multiple thumbs slider" @value-change="setMultipleValue">
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb :index="0" aria-label="First value" />
              <SliderThumb :index="1" aria-label="Second value" />
              <SliderThumb :index="2" aria-label="Third value" />
            </SliderRoot>
            <p class="text-sm text-muted-foreground">Current value: {{ multipleValue.join(', ') }}</p>
          </div>
        </Card>
        <Card title="Orientation" description="Slider supports horizontal and vertical orientation.">
          <div class="flex items-center gap-space-xl">
            <div class="w-full max-w-md">
              <SliderRoot :default-value="[45]" aria-label="Horizontal slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Horizontal slider" /></SliderRoot>
            </div>
            <SliderRoot orientation="vertical" :default-value="[60]" aria-label="Vertical slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Vertical slider" /></SliderRoot>
          </div>
        </Card>
        <Card title="Sizes" description="Slider supports sm, default, and lg sizes.">
          <div class="grid gap-space-md">
            <SliderRoot size="sm" :default-value="[25]" aria-label="Small slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Small slider" /></SliderRoot>
            <SliderRoot :default-value="[50]" aria-label="Default slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Default slider" /></SliderRoot>
            <SliderRoot size="lg" :default-value="[75]" aria-label="Large slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Large slider" /></SliderRoot>
          </div>
        </Card>
        <Card title="Disabled" description="Disabled state blocks input.">
          <div class="grid gap-space-sm">
            <SliderRoot disabled :default-value="[60]" aria-label="Disabled slider">
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb aria-label="Disabled slider" />
            </SliderRoot>
            <p class="text-sm text-muted-foreground">Current value: {{ disabledValue.join(', ') }}</p>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
