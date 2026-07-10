<script lang="ts">
  const componentLinks = [
    { href: '/button', label: 'Button' },
    { href: '/card', label: 'Card' },
    { href: '/checkbox', label: 'Checkbox' },
    { href: '/dialog', label: 'Dialog' },
    { href: '/alert', label: 'Alert' },
    { href: '/badge', label: 'Badge' },
    { href: '/empty', label: 'Empty' },
    { href: '/input', label: 'Input' },
    { href: '/kbd', label: 'Kbd' },
    { href: '/listbox', label: 'Listbox' },
    { href: '/menu', label: 'Menu' },
    { href: '/pagination', label: 'Pagination' },
    { href: '/popover', label: 'Popover' },
    { href: '/radio', label: 'Radio' },
    { href: '/spinner', label: 'Spinner' },
    { href: '/slider', label: 'Slider' },
    { href: '/switch', label: 'Switch' },
    { href: '/table', label: 'Table' },
    { href: '/toast', label: 'Toast' },
    { href: '/sortable', label: 'Sortable' },
    { href: '/interactions', label: 'Interactions' },
    { href: '/resizable', label: 'Resizable' },
    { href: '/textarea', label: 'Textarea' },
  ] as const
</script>

<svelte:head><title>Svelte Admin</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-sm">
      <h1 class="text-2xl font-semibold text-foreground">Svelte Admin</h1>
      <p class="text-sm leading-6 text-muted-foreground">临时导航入口，后续后台功能完整后再调整首页结构。</p>
    </header>

    <section class="space-y-space-md">
      <h2 class="text-base font-medium text-foreground">Components</h2>
      <nav class="grid grid-cols-1 gap-space-sm sm:grid-cols-2 lg:grid-cols-3" aria-label="组件示例">
        {#each componentLinks as link (link.href)}
          <a
            class="rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-muted-background"
            href={link.href}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    </section>
  </div>
</main>
