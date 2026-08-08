<script setup lang="ts">
import ThemeProvider from '@fex-design/vue/primitive/theme-provider'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import ThemeStatusCard from './theme-status-card.vue'

const inheritedTheme = ref<'light' | 'dark'>('dark')
const innerTheme = ref<'light' | 'dark'>('light')
const customTheme = ref<'light' | 'dark' | 'admin-blue'>('admin-blue')
const customThemeOptions = ['admin-blue', 'light', 'dark'] as const

function toggleInheritedTheme() {
  inheritedTheme.value = inheritedTheme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">
          Back home
        </RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">ThemeProvider</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            ThemeProvider supports local scopes, inherited scopes, custom local themes, multiple
            themes on the same page, and a forcedTheme override with the highest priority.
          </p>
        </div>
      </header>

      <Card title="Local Scope" description="A local provider applies theme variables to its own wrapper.">
        <ThemeProvider
          scope="local"
          storage-key="fex-theme-provider-local-demo"
          class="rounded-md bg-background p-space-lg text-foreground"
        >
          <ThemeStatusCard title="Interactive local theme" />
        </ThemeProvider>
      </Card>

      <Card
        title="Multiple Themes"
        description="Independent local scopes can render light and dark together."
      >
        <div class="grid gap-space-lg md:grid-cols-2">
          <ThemeProvider
            scope="local"
            forced-theme="light"
            class="rounded-md bg-background p-space-lg text-foreground"
          >
            <ThemeStatusCard title="Forced light scope" />
          </ThemeProvider>
          <ThemeProvider
            scope="local"
            forced-theme="dark"
            class="rounded-md bg-background p-space-lg text-foreground"
          >
            <ThemeStatusCard title="Forced dark scope" />
          </ThemeProvider>
        </div>
      </Card>

      <Card
        title="Inherited Scope"
        description="Three nested providers: parent can switch, inherited child follows it, inner local scope stays independent."
      >
        <ThemeProvider
          scope="local"
          :forced-theme="inheritedTheme"
          class="rounded-md bg-background p-space-lg text-foreground"
        >
          <button
            class="mb-space-lg rounded-md border border-border bg-card-background px-space-lg py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background"
            type="button"
            @click="toggleInheritedTheme"
          >
            Switch parent to {{ inheritedTheme === 'dark' ? 'light' : 'dark' }}
          </button>
          <div class="grid gap-space-lg lg:grid-cols-3">
            <ThemeStatusCard :title="`Parent local ${inheritedTheme} scope`" />
            <ThemeProvider scope="inherit">
              <div class="space-y-space-lg rounded-md border border-border bg-background p-space-lg">
                <ThemeStatusCard title="Inherited middle scope" />
                <ThemeProvider
                  scope="local"
                  :forced-theme="innerTheme"
                  class="rounded-md bg-background p-space-lg text-foreground"
                >
                  <button
                    class="mb-space-lg rounded-md border border-border bg-card-background px-space-lg py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background"
                    type="button"
                    @click="innerTheme = innerTheme === 'dark' ? 'light' : 'dark'"
                  >
                    Switch inner to {{ innerTheme === 'dark' ? 'light' : 'dark' }}
                  </button>
                  <ThemeStatusCard :title="`Inner independent ${innerTheme} scope`" />
                </ThemeProvider>
              </div>
            </ThemeProvider>
          </div>
        </ThemeProvider>
      </Card>

      <Card
        title="Custom Local Theme"
        description="A local provider can resolve a non-global theme name and expose it through data-theme."
      >
        <ThemeProvider
          scope="local"
          attribute="data-theme"
          :themes="['light', 'dark', 'admin-blue']"
          default-theme="admin-blue"
          :forced-theme="customTheme"
          :color-scheme-map="{ 'admin-blue': 'light' }"
          class="rounded-md border border-border bg-background p-space-lg text-foreground data-[theme=admin-blue]:[--background:oklch(0.97_0.04_245)] data-[theme=admin-blue]:[--card-background:oklch(0.99_0.025_245)] data-[theme=admin-blue]:[--card-foreground:oklch(0.25_0.08_250)] data-[theme=admin-blue]:[--foreground:oklch(0.22_0.08_250)] data-[theme=admin-blue]:[--muted-foreground:oklch(0.45_0.06_250)] data-[theme=admin-blue]:[--border:oklch(0.82_0.07_245)]"
        >
          <div class="mb-space-lg flex flex-wrap gap-space-sm">
            <button
              v-for="theme in customThemeOptions"
              :key="theme"
              class="rounded-md border border-border bg-card-background px-space-md py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background disabled:cursor-default disabled:bg-selected-background"
              :disabled="customTheme === theme"
              type="button"
              @click="customTheme = theme"
            >
              {{ theme }}
            </button>
          </div>
          <ThemeStatusCard :title="`Local ${customTheme} theme`" />
        </ThemeProvider>
      </Card>

      <Card
        title="Forced Theme Priority"
        description="When forcedTheme is set, setTheme is ignored and the resolved theme remains locked."
      >
        <ThemeProvider
          scope="local"
          default-theme="light"
          forced-theme="dark"
          class="rounded-md bg-background p-space-lg text-foreground"
        >
          <ThemeStatusCard title="Locked dark theme" />
        </ThemeProvider>
      </Card>
    </div>
  </main>
</template>
