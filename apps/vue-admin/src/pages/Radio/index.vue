<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioButton, RadioGroup, type RadioValue } from '@fex/components-vue/primitive/radio'
import Card from '@fex/components-vue/ui/card'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
] as const

const controlled = ref<RadioValue>('pear')
const groupValue = ref<RadioValue>('orange')
const buttonValue = ref<RadioValue>('apple')
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Radio</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Single-value radio group with native aria state and button-style radio options.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Basic" description="RadioGroup owns one selected value.">
          <RadioGroup default-value="apple" orientation="horizontal">
            <label v-for="option in options" :key="option.value" class="inline-flex min-w-0 items-center gap-2 text-sm">
              <Radio :value="option.value" />
              <span>{{ option.label }}</span>
            </label>
          </RadioGroup>
        </Card>

        <Card title="Controlled" description="Controlled state uses value and value-change.">
          <div class="grid min-w-0 gap-space-md">
            <RadioGroup :value="controlled" orientation="horizontal" @value-change="(value) => (controlled = value)">
              <label v-for="option in options" :key="option.value" class="inline-flex min-w-0 items-center gap-2 text-sm">
                <Radio :value="option.value" />
                <span>{{ option.label }}</span>
              </label>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Current value: {{ controlled }}</p>
          </div>
        </Card>

        <Card title="Group" description="Vertical group layout still uses one selected value.">
          <div class="grid min-w-0 gap-space-md">
            <RadioGroup :value="groupValue" @value-change="(value) => (groupValue = value)">
              <label v-for="option in options" :key="option.value" class="inline-flex min-w-0 items-center gap-2 text-sm">
                <Radio :value="option.value" />
                <span>{{ option.label }}</span>
              </label>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Selected: {{ groupValue }}</p>
          </div>
        </Card>

        <Card title="RadioButton" description="Button-form radios share the same RadioGroup value.">
          <div class="grid min-w-0 gap-space-md">
            <RadioGroup :value="buttonValue" orientation="horizontal" class="grid grid-cols-3 gap-0" @value-change="(value) => (buttonValue = value)">
              <RadioButton v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</RadioButton>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Current value: {{ buttonValue }}</p>
          </div>
        </Card>

        <Card title="Disabled" description="Disabled state can live on the group or a single radio.">
          <div class="grid min-w-0 gap-space-md">
            <RadioGroup default-value="pear" orientation="horizontal">
              <label class="inline-flex min-w-0 items-center gap-2 text-sm"><Radio value="apple" /><span>Apple</span></label>
              <label class="inline-flex min-w-0 items-center gap-2 text-sm"><Radio value="pear" /><span>Pear</span></label>
              <label class="inline-flex min-w-0 items-center gap-2 text-sm"><Radio value="orange" disabled /><span>Orange disabled</span></label>
            </RadioGroup>
            <RadioGroup default-value="apple" disabled orientation="horizontal" class="grid grid-cols-3 gap-0">
              <RadioButton v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</RadioButton>
            </RadioGroup>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
