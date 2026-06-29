<script lang="ts">
  import PrimitiveButton from '@fex/components-svelte/primitive/button'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'

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
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
{/snippet}

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Button</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          用于触发页面操作、表单提交和工具栏命令。示例覆盖样式、尺寸、加载、图标、效果、组合和禁用状态。
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Primitive" description="按钮底层骨架与最小行为。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <PrimitiveButton>Primitive button</PrimitiveButton>
        </div>
      </Card>

      <Card title="Ui" description="面向业务的默认按钮封装。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          {#each variants as variant}
            <Button {variant}>{variant}</Button>
          {/each}
        </div>
      </Card>

      <Card title="Variants" description="按钮的基础视觉语义。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          {#each variants as variant}
            <Button {variant}>{variant}</Button>
          {/each}
        </div>
      </Card>

      <Card title="Sizes" description="文本按钮和 icon-only 按钮尺寸。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
      </Card>

      <Card title="Loading" description="加载态会禁用按钮，loading icon 跟随 iconPlacement。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Button loading>Loading start</Button>
          <Button loading iconPlacement="end">Loading end</Button>
        </div>
      </Card>

      <Card title="Icon" description="业务图标可放在文字前或文字后。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Button icon={demoIcon}>Icon start</Button>
          <Button icon={demoIcon} iconPlacement="end">Icon end</Button>
        </div>
      </Card>

      <Card title="Effects" description="单独展示适合基础按钮使用的视觉效果。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          {#each effects as effect}
            {#if effect === 'expand-icon'}
              <Button {effect} icon={demoIcon} iconPlacement="end">{effect}</Button>
            {:else}
              <Button {effect} iconPlacement="end">{effect}</Button>
            {/if}
          {/each}
        </div>
      </Card>

      <Card title="Mixed Usage" description="不同 variant、icon、loading 和 effect 的组合。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
      </Card>

      <Card title="Disabled" description="禁用态和不同 variant 的组合。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Button disabled>Disabled</Button>
          <Button disabled variant="outline">Disabled outline</Button>
        </div>
      </Card>
    </div>
  </div>
</main>
