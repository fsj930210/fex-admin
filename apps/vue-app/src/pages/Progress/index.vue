<script setup lang="ts">
import { Progress } from '@fex-design/vue/primitive/progress'
import { CheckIcon } from '@fex-design/vue/icon/check'
import { MinusIcon } from '@fex-design/vue/icon/minus'
import { PlusIcon } from '@fex-design/vue/icon/plus'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
const gradient = { from: '#1677ff', to: '#87d068', direction: 'to right' } as const
const segmentGradient = {
  stops: {
    '0%': 'var(--success)',
    '49.999%': 'var(--success)',
    '50%': 'var(--info)',
    '100%': 'var(--info)',
  },
  direction: 'to right',
} as const
const stepLineDemos = [
  { value: 50, steps: 5, color: 'var(--info)' },
  { value: 30, steps: 5, color: 'var(--info)' },
  { value: 100, steps: 5, color: 'var(--success)', success: true },
  { value: 60, steps: 5, color: 'var(--success)' },
]
const circleStepDemos = [
  { label: 'Custom count', value: 50, steps: 12, gap: 2, color: 'var(--info)' },
  { label: 'Custom gap', value: 100, steps: 8, gap: 5, color: 'var(--success)', success: true },
]
const getActiveSteps = (value: number, steps: number) => Math.round((value / 100) * steps)
const getStepDasharray = (steps: number, gap: number) => {
  const stepLength = 100 / steps
  const dash = Math.max(0, stepLength - gap)
  return `${dash} ${100 - dash}`
}
const dynamicValue = ref(20)
const decrease = () => {
  dynamicValue.value = Math.max(0, dynamicValue.value - 10)
}
const increase = () => {
  dynamicValue.value = Math.min(100, dynamicValue.value + 10)
}
const lines = {
  status: [
    ['Normal', 35, 'normal'],
    ['Info', 68, 'info'],
    ['Warning', 82, 'warning'],
    ['Success', 100, 'success'],
    ['Error', 42, 'error'],
  ],
  sizes: [
    ['Thin · 4px', 30, 4],
    ['Medium · 8px', 55, 8],
    ['Large · 12px', 80, 12],
  ],
  linecaps: [
    ['Round line / round track', 'round', undefined],
    ['Butt · round track', 'butt', 'round'],
    ['Square line / round track', 'square', undefined],
  ],
}
</script>
<template>
  <main class="grid gap-space-xl p-page-padding">
    <Card
      title="Basic"
      description="A determinate line progress bar with an external label and value."
      ><div class="grid max-w-xl gap-space-sm">
        <div class="flex justify-between text-sm">
          <span>Upload progress</span><span class="text-muted-foreground">35%</span>
        </div>
        <Progress :value="35" /></div></Card
    ><Card title="Status" description="Info, warning, success and error use system semantic tokens."
      ><div class="grid max-w-xl gap-space-lg">
        <div v-for="[label, value, status] in lines.status" :key="label" class="grid gap-space-sm">
          <div class="flex justify-between text-sm">
            <span>{{ label }}</span
            ><span class="text-muted-foreground">{{ value }}%</span>
          </div>
          <Progress :value="value as number" :status="status as any" />
        </div></div></Card
    ><Card title="Color" description="Use arbitrary CSS colors, track colors and gradients."
      ><div class="grid max-w-xl gap-space-lg">
        <Progress :value="68" color="#7c3aed" /><Progress
          :value="52"
          color="#0891b2"
          track-color="#cffafe"
        /><Progress :value="88" :color="gradient" /></div></Card
    ><Card title="Segmented" description="Use hard color stops to show staged progress."
      ><div class="grid max-w-xl gap-space-xl">
        <div class="grid gap-space-sm">
          <div class="flex justify-between text-sm">
            <span>Segmented line</span><span class="text-muted-foreground">60%</span>
          </div>
          <Progress :value="60" :color="segmentGradient" show-value />
        </div>
        <div class="flex flex-wrap gap-space-xl">
          <div class="grid justify-items-center gap-space-sm">
            <Progress
              variant="circle"
              :value="60"
              :size="112"
              :thickness="8"
              :color="segmentGradient"
              show-value
            />
            <span class="text-sm">Circle</span>
          </div>
          <div class="grid justify-items-center gap-space-sm">
            <Progress
              variant="dashboard"
              :value="60"
              :size="112"
              :thickness="8"
              :color="segmentGradient"
              :gap-degree="90"
              show-value
            />
            <span class="text-sm">Dashboard</span>
          </div>
        </div>
      </div></Card
    ><Card title="Step Line" description="Show progress as fixed linear steps."
      ><div class="grid gap-space-lg">
        <div v-for="demo in stepLineDemos" :key="demo.value" class="flex items-center gap-space-sm">
          <div class="flex gap-1">
            <span
              v-for="index in demo.steps"
              :key="index"
              class="h-2 w-4 rounded-[1px]"
              :style="{
                background:
                  index <= getActiveSteps(demo.value, demo.steps)
                    ? demo.color
                    : 'var(--progress-remaining)',
              }"
            />
          </div>
          <span
            v-if="demo.success"
            class="inline-flex size-4 items-center justify-center rounded-full bg-success text-[10px] text-white"
            ><CheckIcon class="size-3"
          /></span>
          <span v-else class="text-sm">{{ demo.value }}%</span>
        </div>
      </div></Card
    ><Card title="Step Circle" description="Show progress as fixed circular steps with custom count and gap."
      ><div class="flex flex-wrap gap-space-xl">
        <div
          v-for="demo in circleStepDemos"
          :key="demo.label"
          class="grid justify-items-center gap-space-sm"
        >
          <div class="relative inline-flex size-32 items-center justify-center">
            <svg aria-hidden="true" class="size-32" viewBox="0 0 128 128">
              <circle
                v-for="index in demo.steps"
                :key="index"
                cx="64"
                cy="64"
                r="56"
                fill="none"
                :stroke="
                  index <= getActiveSteps(demo.value, demo.steps)
                    ? demo.color
                    : 'var(--progress-remaining)'
                "
                stroke-width="16"
                stroke-linecap="butt"
                pathLength="100"
                :stroke-dasharray="getStepDasharray(demo.steps, demo.gap)"
                :stroke-dashoffset="50 - ((index - 1) * (100 / demo.steps))"
              />
            </svg>
            <span class="absolute text-2xl"
              ><CheckIcon v-if="demo.success" class="size-8 text-success" /><template v-else
                >{{ demo.value }}%</template
              ></span
            >
          </div>
          <span class="text-sm">{{ demo.label }}</span>
        </div>
      </div></Card
    ><Card title="Size" description="Configure line thickness."
      ><div class="grid max-w-xl gap-space-lg">
        <div
          v-for="[label, value, thickness] in lines.sizes"
          :key="label"
          class="grid gap-space-sm"
        >
          <span class="text-sm">{{ label }}</span
          ><Progress :value="value as number" :thickness="thickness as number" />
        </div></div></Card
    ><Card title="Linecap" description="Round line / round track, butt and square endings with the same value."
      ><div class="grid max-w-xl gap-space-lg">
        <div
          v-for="[label, linecap, trackLinecap] in lines.linecaps"
          :key="label"
          class="grid gap-space-sm"
        >
          <span class="text-sm">{{ label }}</span
          ><Progress
            :value="36"
            :thickness="12"
            :linecap="linecap as any"
            :track-linecap="trackLinecap as any"
          />
        </div></div></Card
    ><Card title="Circle" description="Circular progress supports status and gradients."
      ><div class="flex flex-wrap gap-space-xl">
        <Progress
          variant="circle"
          :value="72"
          :size="96"
          :thickness="8"
          :color="gradient"
          show-value
        /><Progress
          variant="circle"
          :value="100"
          :size="96"
          :thickness="8"
          status="success"
          show-value
        /><Progress
          variant="circle"
          :value="42"
          :size="96"
          :thickness="8"
          status="error"
          show-value
        /></div></Card
    ><Card title="Dashboard" description="Configure the gap degree and placement."
      ><div class="flex flex-wrap gap-space-xl">
        <Progress
          variant="dashboard"
          :value="64"
          :size="96"
          :thickness="8"
          :gap-degree="90"
          show-value
        /><Progress
          variant="dashboard"
          :value="64"
          :size="96"
          :thickness="8"
          :gap-degree="90"
          gap-placement="top"
          show-value
        /></div></Card
    ><Card title="Dynamic" description="Control the same progress value from external actions."
      ><div class="grid max-w-xl gap-space-lg">
        <div class="grid gap-space-sm">
          <div class="flex justify-between text-sm">
            <span>Controlled line</span
            ><span class="text-muted-foreground">{{ dynamicValue }}%</span>
          </div>
          <Progress :value="dynamicValue" />
        </div>
        <div class="flex flex-wrap items-center gap-space-xl">
          <Progress variant="circle" :value="dynamicValue" :size="96" :thickness="8" show-value />
          <div class="flex gap-space-sm">
            <Button variant="outline" size="icon-sm" :disabled="dynamicValue <= 0" @click="decrease"
              ><MinusIcon /></Button
            ><Button
              variant="outline"
              size="icon-sm"
              :disabled="dynamicValue >= 100"
              @click="increase"
              ><PlusIcon
            /></Button>
          </div>
        </div></div></Card
    ><Card title="Indeterminate" description="Use a moving indicator when the value is unknown."
      ><div class="grid max-w-xl gap-space-xl">
        <div><span>Processing</span><Progress :value="null" /></div>
        <div class="grid w-fit justify-items-center gap-space-sm">
          <Progress variant="circle" :value="null" :size="72" :thickness="6" color="#1677ff" />
          <span class="text-sm">Processing</span>
        </div>
      </div></Card
    >
  </main>
</template>
