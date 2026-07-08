<script setup lang="ts">
import { ref } from 'vue'
import { SwitchRoot, SwitchThumb } from '@fex/components-vue/primitive/switch'
import Card from '@fex/components-vue/ui/card'
const checked = ref(true)
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div><h1 class="text-2xl font-semibold text-foreground">Switch</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Boolean toggle UI with controlled and uncontrolled usage.</p></div>
      </header>
      <div class="space-y-space-xl">
        <Card title="Basic" description="Uncontrolled switch uses defaultChecked."><SwitchRoot default-checked aria-label="Enable notifications"><template #default="{ checked: currentChecked }"><SwitchThumb :checked="currentChecked" /></template></SwitchRoot></Card>
        <Card title="Controlled" description="Controlled switch uses checked and checked-change."><div class="grid gap-space-md"><SwitchRoot :checked="checked" aria-label="Controlled switch" @checked-change="(next) => (checked = next)"><template #default="{ checked: currentChecked }"><SwitchThumb :checked="currentChecked" /></template></SwitchRoot><p class="text-sm text-muted-foreground">Current value: {{ String(checked) }}</p></div></Card>
        <Card title="Sizes" description="Switch supports sm, default, and lg sizes."><div class="flex items-center gap-space-md"><SwitchRoot size="sm" default-checked aria-label="Small switch"><template #default="{ checked: currentChecked }"><SwitchThumb size="sm" :checked="currentChecked" /></template></SwitchRoot><SwitchRoot default-checked aria-label="Default switch"><template #default="{ checked: currentChecked }"><SwitchThumb :checked="currentChecked" /></template></SwitchRoot><SwitchRoot size="lg" default-checked aria-label="Large switch"><template #default="{ checked: currentChecked }"><SwitchThumb size="lg" :checked="currentChecked" /></template></SwitchRoot></div></Card>
        <Card title="Disabled" description="Disabled state blocks interaction."><div class="flex items-center gap-space-md"><SwitchRoot disabled aria-label="Disabled switch"><template #default="{ checked: currentChecked }"><SwitchThumb :checked="currentChecked" /></template></SwitchRoot><SwitchRoot disabled default-checked aria-label="Disabled checked switch"><template #default="{ checked: currentChecked }"><SwitchThumb :checked="currentChecked" /></template></SwitchRoot></div></Card>
      </div>
    </div>
  </main>
</template>
