<script lang="ts">
  import Card from '@fex/components-svelte/ui/card'
  import Popover from '@fex/components-svelte/primitive/popover'
  import PopoverArrow from '@fex/components-svelte/primitive/popover-arrow'
  import PopoverContent from '@fex/components-svelte/primitive/popover-content'
  import PopoverDescription from '@fex/components-svelte/primitive/popover-description'
  import PopoverHeader from '@fex/components-svelte/primitive/popover-header'
  import PopoverPortal from '@fex/components-svelte/primitive/popover-portal'
  import PopoverTitle from '@fex/components-svelte/primitive/popover-title'
  import PopoverTrigger from '@fex/components-svelte/primitive/popover-trigger'

  let open = $state(false)
  let container = $state<HTMLDivElement>()
  const outlineButtonClass =
    'inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
  const secondaryButtonClass =
    'inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-secondary-background px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'

  const placementGroups = [
    [
      { label: 'TL', placement: 'topLeft' },
      { label: 'Top', placement: 'top' },
      { label: 'TR', placement: 'topRight' },
    ],
    [
      { label: 'LT', placement: 'leftTop' },
      { label: 'RT', placement: 'rightTop' },
    ],
    [
      { label: 'Left', placement: 'left' },
      { label: 'Right', placement: 'right' },
    ],
    [
      { label: 'LB', placement: 'leftBottom' },
      { label: 'RB', placement: 'rightBottom' },
    ],
    [
      { label: 'BL', placement: 'bottomLeft' },
      { label: 'Bottom', placement: 'bottom' },
      { label: 'BR', placement: 'bottomRight' },
    ],
  ] as const
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">杩斿洖棣栭〉</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Popover</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          鍩轰簬 core floating overlay 鐨?Svelte 閫傞厤锛岃鐩栬Е鍙戞柟寮忋€佷綅缃€佸彈鎺х姸鎬佸拰鑷畾涔夋寕杞藉鍣ㄣ€?        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Primitive" description="Demo.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Popover side="bottom" align="start" sideOffset={8} arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class="text-sm text-foreground hover:text-primary">Primitive trigger</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Primitive content</PopoverTitle>
                  <PopoverDescription>Content uses shared floating variables and data attributes.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>

      <Card title="Ui" description="Demo.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Popover placement="bottomLeft" sideOffset={8} arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={outlineButtonClass}>Click</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Click trigger</PopoverTitle>
                  <PopoverDescription>The popover opens immediately while positioning stays in CSS variables.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>

      <Card title="Triggers" description="Demo.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Popover trigger={['hover', 'focus']} hoverCloseDelay={120} arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={secondaryButtonClass}>Hover or focus</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Combined trigger</PopoverTitle>
                  <PopoverDescription>Hover and focus share one trigger source model, so they do not close each other incorrectly.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>

          <Popover trigger={['context-menu']} placement="rightTop" sideOffset={8}>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={outlineButtonClass}>Right click</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverHeader class="w-64">
                  <PopoverTitle>Context menu trigger</PopoverTitle>
                  <PopoverDescription>This is still Popover content; future ContextMenu will reuse the same trigger and floating core with Menu.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>

      <Card title="Placement" description="Demo.">
        <div class="flex w-full flex-col items-center gap-space-md py-space-lg">
          {#each placementGroups as group, rowIndex}
            <div class="grid w-full max-w-xl grid-cols-[repeat(3,minmax(80px,1fr))] items-center gap-x-space-lg gap-y-space-md">
              {#if rowIndex > 0 && rowIndex < 4}
                <div class="justify-self-start">
                  <Popover placement={group[0].placement} sideOffset={10} arrow>
                    <PopoverTrigger>
                      {#snippet children(slot)}
                        <button {...slot.props} use:slot.action class={`${outlineButtonClass} w-24`}>{group[0].label}</button>
                      {/snippet}
                    </PopoverTrigger>
                    <PopoverPortal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader class="w-44">
                          <PopoverTitle>{group[0].placement}</PopoverTitle>
                          <PopoverDescription>Edge placements flip instead of shifting across the trigger.</PopoverDescription>
                        </PopoverHeader>
                      </PopoverContent>
                    </PopoverPortal>
                  </Popover>
                </div>
                <div></div>
                <div class="justify-self-end">
                  <Popover placement={group[1].placement} sideOffset={10} arrow>
                    <PopoverTrigger>
                      {#snippet children(slot)}
                        <button {...slot.props} use:slot.action class={`${outlineButtonClass} w-24`}>{group[1].label}</button>
                      {/snippet}
                    </PopoverTrigger>
                    <PopoverPortal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader class="w-44">
                          <PopoverTitle>{group[1].placement}</PopoverTitle>
                          <PopoverDescription>Edge placements flip instead of shifting across the trigger.</PopoverDescription>
                        </PopoverHeader>
                      </PopoverContent>
                    </PopoverPortal>
                  </Popover>
                </div>
              {:else}
                {#each group as item (item.placement)}
                  <div class="justify-self-center">
                    <Popover placement={item.placement} sideOffset={10} arrow>
                      <PopoverTrigger>
                        {#snippet children(slot)}
                          <button {...slot.props} use:slot.action class={`${outlineButtonClass} w-24`}>{item.label}</button>
                        {/snippet}
                      </PopoverTrigger>
                      <PopoverPortal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverHeader class="w-44">
                            <PopoverTitle>{item.placement}</PopoverTitle>
                            <PopoverDescription>Single-axis placements shift; edge placements only flip.</PopoverDescription>
                          </PopoverHeader>
                        </PopoverContent>
                      </PopoverPortal>
                    </Popover>
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        </div>
      </Card>

      <Card title="Offsets" description="Tune main-axis sideOffset and cross-axis alignOffset.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Popover placement="bottomLeft" sideOffset={18} arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={outlineButtonClass}>sideOffset 18</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Main-axis offset</PopoverTitle>
                  <PopoverDescription>sideOffset increases the distance between trigger and content.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>

          <Popover placement="bottomLeft" sideOffset={8} alignOffset={28} arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={outlineButtonClass}>alignOffset 28</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Cross-axis offset</PopoverTitle>
                  <PopoverDescription>alignOffset moves the aligned edge along the cross axis.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>

      <Card title="Controlled" description="Demo.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Popover {open} onOpenChange={(nextOpen) => (open = nextOpen)} placement="bottomLeft" arrow>
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={open ? secondaryButtonClass : outlineButtonClass}>
                  {open ? 'Controlled open' : 'Controlled closed'}
                </button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader class="w-64">
                  <PopoverTitle>Controlled popover</PopoverTitle>
                  <PopoverDescription>Click outside or press Escape to request closing through onOpenChange.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>

      <Card title="getPopupContainer" description="Demo.">
        <div bind:this={container} class="relative min-h-40 rounded-md border border-dashed p-space-lg">
          <Popover getPopupContainer={() => container ?? document.body} placement="bottomLeft">
            <PopoverTrigger>
              {#snippet children(slot)}
                <button {...slot.props} use:slot.action class={outlineButtonClass}>Mount inside dashed box</button>
              {/snippet}
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent>
                <PopoverHeader class="w-64">
                  <PopoverTitle>Custom container</PopoverTitle>
                  <PopoverDescription>The portal node is rendered inside the dashed container.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </Card>
    </div>
  </div>
</main>
