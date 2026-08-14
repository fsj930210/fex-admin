<script setup lang="ts">
const componentLinks = [
  { to: '/anchor', label: 'Anchor' },
  { to: '/aspect-ratio', label: 'AspectRatio' },
  { to: '/avatar', label: 'Avatar' },
  { to: '/auto-complete', label: 'AutoComplete' },
  { to: '/carousel', label: 'Carousel' },
  { to: '/cascader', label: 'Cascader' },
  { to: '/button', label: 'Button' },
  { to: '/calendar', label: 'Calendar' },
    { to: '/card', label: 'Card' },
    { to: '/checkbox', label: 'Checkbox' },
    { to: '/collapse', label: 'Collapse' },
    { to: '/color-picker', label: 'ColorPicker' },
  { to: '/context-menu', label: 'ContextMenu' },
    { to: '/dialog', label: 'Dialog' },
  { to: '/drawer', label: 'Drawer' },
  { to: '/dropdown', label: 'Dropdown' },
  { to: '/alert', label: 'Alert' },
  { to: '/badge', label: 'Badge' },
  { to: '/tag', label: 'Tag' },
  { to: '/breadcrumb', label: 'Breadcrumb' },
  { to: '/empty', label: 'Empty' },
  { to: '/form', label: 'Form' },
  { to: '/input', label: 'Input' },
  { to: '/input-number', label: 'InputNumber' },
  { to: '/input-otp', label: 'InputOTP' },
  { to: '/kbd', label: 'Kbd' },
  { to: '/listbox', label: 'Listbox' },
  { to: '/menu', label: 'Menu' },
  { to: '/mentions', label: 'Mentions' },
  { to: '/pagination', label: 'Pagination' },
  { to: '/popover', label: 'Popover' },
  { to: '/progress', label: 'Progress' },
  { to: '/separator', label: 'Separator' },
  { to: '/skeleton', label: 'Skeleton' },
  { to: '/radio', label: 'Radio' },
  { to: '/qrcode', label: 'QRCode' },
  { to: '/rate', label: 'Rate' },
  { to: '/spinner', label: 'Spinner' },
  { to: '/slider', label: 'Slider' },
  { to: '/scrollbar', label: 'Scrollbar' },
  { to: '/select', label: 'Select' },
  { to: '/switch', label: 'Switch' },
  { to: '/table', label: 'Table' },
  { to: '/tabs', label: 'Tabs' },
  { to: '/steps', label: 'Steps' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/toggle', label: 'Toggle' },
  { to: '/transfer', label: 'Transfer' },
  { to: '/upload', label: 'Upload' },
  { to: '/data-table', label: 'Data Table' },
  { to: '/date-picker', label: 'DatePicker' },
  { to: '/tree', label: 'Tree' },
  { to: '/tree-select', label: 'TreeSelect' },
  { to: '/toast', label: 'Toast' },
  { to: '/sortable', label: 'Sortable' },
  { to: '/interactions', label: 'Interactions' },
  { to: '/resizable', label: 'Resizable' },
  { to: '/textarea', label: 'Textarea' },
  { to: '/theme-provider', label: 'ThemeProvider' },
  { to: '/time-picker', label: 'TimePicker' },
  { to: '/tooltip', label: 'Tooltip' },
  { to: '/tour', label: 'Tour' },
  { to: '/watermark', label: 'Watermark' },
].sort((left, right) => left.label.localeCompare(right.label))
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
