<script setup lang="ts">
const componentLinks = [
  { to: '/button', label: 'Button' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/card', label: 'Card' },
  { to: '/checkbox', label: 'Checkbox' },
  { to: '/dialog', label: 'Dialog' },
  { to: '/alert', label: 'Alert' },
  { to: '/badge', label: 'Badge' },
  { to: '/empty', label: 'Empty' },
  { to: '/input', label: 'Input' },
  { to: '/kbd', label: 'Kbd' },
  { to: '/listbox', label: 'Listbox' },
  { to: '/menu', label: 'Menu' },
  { to: '/pagination', label: 'Pagination' },
  { to: '/popover', label: 'Popover' },
  { to: '/radio', label: 'Radio' },
  { to: '/spinner', label: 'Spinner' },
  { to: '/slider', label: 'Slider' },
  { to: '/switch', label: 'Switch' },
  { to: '/table', label: 'Table' },
  { to: '/tree', label: 'Tree' },
  { to: '/toast', label: 'Toast' },
  { to: '/sortable', label: 'Sortable' },
  { to: '/interactions', label: 'Interactions' },
  { to: '/resizable', label: 'Resizable' },
  { to: '/textarea', label: 'Textarea' },
] as const
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-sm">
        <h1 class="text-2xl font-semibold text-foreground">Vue Admin</h1>
        <p class="text-sm leading-6 text-muted-foreground">
          临时导航入口，后续后台功能完整后再调整首页结构。
        </p>
      </header>

      <section class="space-y-space-md">
        <h2 class="text-base font-medium text-foreground">Components</h2>
        <nav
          class="grid grid-cols-1 gap-space-sm sm:grid-cols-2 lg:grid-cols-3"
          aria-label="组件示例"
        >
          <RouterLink
            v-for="link in componentLinks"
            :key="link.to"
            class="rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-muted-background"
            :to="link.to"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </section>
    </div>
  </main>
</template>
