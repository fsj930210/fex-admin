<script lang="ts">
  import Button from '@fex/components-svelte/button'

  const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link', 'dashed'] as const
  const sizes = ['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
  const effects = [
    'expand-icon',
    'ring-hover',
    'shine',
    'shine-hover',
    'gooey-left',
    'gooey-right',
    'gradient-slide-show',
  ] as const
</script>

{#snippet demoIcon()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
{/snippet}

<main class="space-y-8 p-6">
  <header class="space-y-2">
    <a href="/">返回首页</a>
    <h1 class="text-2xl font-semibold">Button</h1>
  </header>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Variants</h2>
    <div class="flex flex-wrap gap-3">
      {#each variants as variant}
        <Button {variant}>{variant}</Button>
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Sizes</h2>
    <div class="flex flex-wrap items-center gap-3">
      {#each sizes as size}
        <Button {size} aria-label={size.startsWith('icon') ? size : undefined}>
          {#if size.startsWith('icon')}
            {@render demoIcon()}
          {:else}
            {size}
          {/if}
        </Button>
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Loading</h2>
    <div class="flex flex-wrap gap-3">
      <Button loading>Loading start</Button>
      <Button loading iconPlacement="end">Loading end</Button>
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Icon</h2>
    <div class="flex flex-wrap gap-3">
      <Button icon={demoIcon}>Icon start</Button>
      <Button icon={demoIcon} iconPlacement="end">Icon end</Button>
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Effects</h2>
    <div class="flex flex-wrap gap-3">
      {#each effects as effect}
        {#if effect === 'expand-icon'}
          <Button {effect} icon={demoIcon} iconPlacement="end">{effect}</Button>
        {:else}
          <Button {effect}>{effect}</Button>
        {/if}
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Mixed Usage</h2>
    <div class="flex flex-wrap gap-3">
      <Button effect="expand-icon" icon={demoIcon} iconPlacement="end">Icon right</Button>
      <Button effect="expand-icon" icon={demoIcon}>Icon left</Button>
      <Button variant="secondary" effect="gooey-left">Secondary gooey left</Button>
      <Button variant="destructive" effect="gooey-right">Destructive gooey right</Button>
      <Button variant="destructive" effect="shine">Destructive shine</Button>
      <Button variant="outline" effect="ring-hover">Outline ring hover</Button>
      <Button variant="link" effect="hover-underline">Link hover underline</Button>
      <Button variant="link" effect="underline">Link underline</Button>
      <Button variant="outline" effect="hover-underline">Outline hover underline</Button>
      <Button variant="outline" effect="underline">Outline underline</Button>
      <Button variant="destructive" loading>Destructive loading</Button>
      <Button loading iconPlacement="end">Loading with icon</Button>
    </div>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-medium">Disabled</h2>
    <div class="flex flex-wrap gap-3">
      <Button disabled>Disabled</Button>
      <Button disabled variant="outline">Disabled outline</Button>
    </div>
  </section>
</main>
