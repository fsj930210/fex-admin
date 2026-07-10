<script lang="ts">
  import {
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastIcon,
    ToastRoot,
    ToastTitle,
    ToastViewport,
    toast,
  } from '@fex/components-svelte/primitive/toast'
  import CheckIcon from '@fex/components-svelte/icon/check'
  import CloseIcon from '@fex/components-svelte/icon/close'
  import ErrorIcon from '@fex/components-svelte/icon/error'
  import InfoIcon from '@fex/components-svelte/icon/info'
  import LoadingIcon from '@fex/components-svelte/icon/loading'
  import WarningIcon from '@fex/components-svelte/icon/warning'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'
  type ToastPlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

  const placements: ToastPlacement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
  let placement = $state<ToastPlacement>('top')
  let stack = $state(false)
  let manualId = $state<string | null>(null)

  function labelPlacement(value: ToastPlacement) {
    return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  }

  function choosePlacement(value: ToastPlacement) {
    placement = value
    toast.show({
      id: 'toast-position-preview',
      placement: value,
      title: `Position: ${labelPlacement(value)}`,
      duration: 2000,
    })
  }

  function hasToastIcon(item: { icon?: unknown | null, variant: string }) {
    return item.icon !== null && (item.icon !== undefined || isBuiltInIconVariant(item.variant))
  }

  function isBuiltInIconVariant(variant: string) {
    return variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
  }

  function showManyMessages() {
    for (let index = 1; index <= 6; index += 1) {
      toast.info({
        title: `Message ${index}: ${index % 2 === 0 ? 'This is a slightly longer stacked message.' : 'This is a stacked message.'}`,
        duration: 5000,
      })
    }
  }

  function showManualToast() {
    manualId = toast.loading({ title: 'Uploading report', description: 'This toast stays until it is dismissed manually.', duration: -1 })
  }

  function toggleStack() {
    stack = !stack
    toast.configure({ max: stack ? -1 : 5 })
  }
</script>

{#snippet richIcon()}<CheckIcon class="size-4" />{/snippet}
{#snippet undoAction()}<Button size="sm">Undo</Button>{/snippet}

<svelte:head><title>Toast - Svelte Admin</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-6xl space-y-space-lg">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">Toast</h1>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">Primitive global feedback with quick calls, custom content, position, max count, manual destroy, stable id updates, and stacked display.</p>
    </header>

    <Card title="Types" description="Built-in variants only provide default semantics. Content and icon can still be customized.">
      <div class="flex flex-wrap gap-space-sm">
        <Button variant="outline" onclick={() => toast.show('Hello, Fex Design!')}>Default</Button>
        <Button variant="outline" onclick={() => toast.success('This is a success message')}>Success</Button>
        <Button variant="outline" onclick={() => toast.info('This is an info message')}>Info</Button>
        <Button variant="outline" onclick={() => toast.warning('This is a warning message')}>Warning</Button>
        <Button variant="outline" onclick={() => toast.error('This is an error message')}>Error</Button>
        <Button variant="outline" onclick={() => toast.loading({ title: 'Loading data', duration: 2500 })}>Loading</Button>
      </div>
    </Card>

    <Card title="Position" description="The viewport controls placement. Service calls do not need to know where the toast appears.">
      <div class="flex flex-wrap gap-space-sm">
        {#each placements as item (item)}
          <Button
            variant={placement === item ? 'default' : 'outline'}
            onclick={() => choosePlacement(item)}
          >
            {labelPlacement(item)}
          </Button>
        {/each}
      </div>
    </Card>

    <Card title="Custom Content" description="Primitive parts let callers replace icon, add description, and render an action without changing the manager.">
      <div class="flex flex-wrap gap-space-sm">
        <Button variant="outline" onclick={() => toast.success({ title: 'Event has been created', description: 'Monday, January 3rd at 6:00pm', icon: richIcon })}>Rich content</Button>
        <Button variant="outline" onclick={() => toast.show({ title: 'Event has been created', description: 'Sunday, December 03, 2023 at 9:00 AM', action: undoAction, duration: 6000 })}>With action</Button>
      </div>
    </Card>

    <Card title="Update And Destroy" description="A stable id updates one toast. Returned ids can be dismissed manually.">
      <div class="flex flex-wrap gap-space-sm">
        <Button variant="outline" onclick={() => toast.loading({ id: 'save-user', title: 'Saving user', duration: -1 })}>Open keyed loading</Button>
        <Button variant="outline" onclick={() => toast.success({ id: 'save-user', title: 'Saved user', description: 'The same id updates the existing toast.', duration: 2500 })}>Update keyed toast</Button>
        <Button variant="outline" onclick={showManualToast}>Manual toast</Button>
        <Button variant="outline" disabled={!manualId} onclick={() => manualId && toast.dismiss(manualId)}>Destroy manual</Button>
        <Button variant="outline" onclick={() => toast.clear()}>Destroy all</Button>
      </div>
    </Card>

    <Card title="Multiple And Stacked" description="Max count limits the queue. Stack mode collapses older messages and leaves the latest visible.">
      <div class="flex flex-wrap gap-space-sm">
        <Button variant="outline" onclick={showManyMessages}>Show many</Button>
        <Button variant={stack ? 'default' : 'outline'} onclick={toggleStack}>{stack ? 'Stack on' : 'Stack off'}</Button>
      </div>
    </Card>
  </div>

  <ToastViewport offset={72} {stack} stackThreshold={3}>
    {#snippet children(items)}
      {#each items as item (item.id)}
        <ToastRoot toast={item}>
          {#if hasToastIcon(item)}
            <ToastIcon>
              {#if typeof item.icon === 'function'}
                {@render item.icon()}
              {:else if item.icon !== undefined}
                {item.icon}
              {:else if item.variant === 'success'}
                <CheckIcon class="size-4" />
              {:else if item.variant === 'loading'}
                <LoadingIcon class="size-4 animate-spin" />
              {:else if item.variant === 'info'}
                <InfoIcon class="size-4" />
              {:else if item.variant === 'warning'}
                <WarningIcon class="size-4" />
              {:else if item.variant === 'error'}
                <ErrorIcon class="size-4" />
              {/if}
            </ToastIcon>
          {/if}
          <ToastTitle>{item.title}</ToastTitle>
          <ToastClose toast={item}><CloseIcon class="size-4" /></ToastClose>
          {#if item.description}
            <ToastDescription>{item.description}</ToastDescription>
          {/if}
          {#if item.action}
            <ToastAction>
              {#if typeof item.action === 'function'}
                {@render item.action()}
              {:else}
                {item.action}
              {/if}
            </ToastAction>
          {/if}
        </ToastRoot>
      {/each}
    {/snippet}
  </ToastViewport>
</main>
