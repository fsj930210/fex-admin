<script setup lang="ts">
import { useTheme } from '@fex-design/vue/primitive/theme-provider/use-theme'
import { computed } from 'vue'

defineProps<{ title: string }>()

const { controller, snapshot } = useTheme()
const canSwitchTheme = computed(
  () => !snapshot.value.forcedTheme && snapshot.value.themes.includes('light') && snapshot.value.themes.includes('dark'),
)
const nextTheme = computed(() => (snapshot.value.resolvedTheme === 'dark' ? 'light' : 'dark'))
</script>

<template>
  <div class="rounded-md border border-border bg-card-background p-space-lg text-card-foreground shadow-card">
    <div class="space-y-space-sm">
      <p class="text-base font-medium">{{ title }}</p>
      <p class="text-sm text-muted-foreground">theme: {{ snapshot.theme }}</p>
      <p class="text-sm text-muted-foreground">resolvedTheme: {{ snapshot.resolvedTheme }}</p>
      <p class="text-sm text-muted-foreground">forcedTheme: {{ snapshot.forcedTheme ?? 'none' }}</p>
    </div>
    <button
      class="mt-space-lg rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-hover-background disabled:cursor-not-allowed disabled:text-disabled-foreground"
      :disabled="!canSwitchTheme"
      type="button"
      @click="controller.setTheme(nextTheme)"
    >
      {{ snapshot.forcedTheme ? 'Locked by forcedTheme' : `Switch to ${nextTheme}` }}
    </button>
  </div>
</template>
