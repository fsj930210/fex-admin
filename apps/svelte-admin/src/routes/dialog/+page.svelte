<script lang="ts">
  import Dialog from '@fex/components-svelte/primitive/dialog'
  import DialogBody from '@fex/components-svelte/primitive/dialog-body'
  import DialogClose from '@fex/components-svelte/primitive/dialog-close'
  import DialogContent from '@fex/components-svelte/primitive/dialog-content'
  import DialogDescription from '@fex/components-svelte/primitive/dialog-description'
  import DialogFooter from '@fex/components-svelte/primitive/dialog-footer'
  import DialogHeader from '@fex/components-svelte/primitive/dialog-header'
  import DialogOverlay from '@fex/components-svelte/primitive/dialog-overlay'
  import DialogPortal from '@fex/components-svelte/primitive/dialog-portal'
  import DialogTitle from '@fex/components-svelte/primitive/dialog-title'
  import DialogTrigger from '@fex/components-svelte/primitive/dialog-trigger'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'

  let open = $state(false)
  const sizes = ['sm', 'md', 'lg'] as const
  const iconCloseClass =
    'absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Dialog</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Primitive modal composition backed by the shared core overlay controller.
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Primitive" description="Trigger exposes snippet props and content owns ARIA labels.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Dialog>
            <DialogTrigger>
              {#snippet children(slot)}
                <Button
                  action={slot.action}
                  aria-controls={slot.props['aria-controls']}
                  aria-expanded={slot.props['aria-expanded']}
                  aria-haspopup={slot.props['aria-haspopup']}
                  data-state={slot.props['data-state']}
                  onclick={slot.props.onclick}
                >Open dialog</Button>
              {/snippet}
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogClose class={iconCloseClass} aria-label="Close">&times;</DialogClose>
                <DialogHeader>
                  <DialogTitle>Archive record</DialogTitle>
                  <DialogDescription>Review the record before archiving it.</DialogDescription>
                </DialogHeader>
                <DialogBody>The shared controller handles open state, mounted phase, Escape, and top-layer dismiss.</DialogBody>
                <DialogFooter>
                  <DialogClose>
                    {#snippet button(props)}
                      <Button onclick={props.onclick} variant="outline">Cancel</Button>
                    {/snippet}
                  </DialogClose>
                  <DialogClose>
                    {#snippet button(props)}
                      <Button onclick={props.onclick}>Confirm</Button>
                    {/snippet}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      </Card>

      <Card title="Controlled" description="Controlled mode requests updates through onOpenChange.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Dialog {open} onOpenChange={(nextOpen) => (open = nextOpen)}>
            <DialogTrigger>
              {#snippet children(slot)}
                <Button
                  action={slot.action}
                  aria-controls={slot.props['aria-controls']}
                  aria-expanded={slot.props['aria-expanded']}
                  aria-haspopup={slot.props['aria-haspopup']}
                  data-state={slot.props['data-state']}
                  onclick={slot.props.onclick}
                  variant="outline"
                >{open ? 'Open' : 'Closed'}</Button>
              {/snippet}
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogClose class={iconCloseClass} aria-label="Close">&times;</DialogClose>
                <DialogHeader>
                  <DialogTitle>Controlled dialog</DialogTitle>
                  <DialogDescription>The parent owns the open state.</DialogDescription>
                </DialogHeader>
                <DialogBody>Overlay click and Escape request closing through the controlled callback.</DialogBody>
                <DialogFooter>
                  <DialogClose>
                    {#snippet button(props)}
                      <Button onclick={props.onclick}>Done</Button>
                    {/snippet}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      </Card>

      <Card title="Sizes" description="Content size is a primitive style variant.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          {#each sizes as size (size)}
            <Dialog>
              <DialogTrigger>
                {#snippet children(slot)}
                  <Button
                    action={slot.action}
                    aria-controls={slot.props['aria-controls']}
                    aria-expanded={slot.props['aria-expanded']}
                    aria-haspopup={slot.props['aria-haspopup']}
                    data-state={slot.props['data-state']}
                    onclick={slot.props.onclick}
                    variant="outline"
                  >{size}</Button>
                {/snippet}
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent {size}>
                  <DialogClose class={iconCloseClass} aria-label="Close">&times;</DialogClose>
                  <DialogHeader>
                    <DialogTitle>{size} dialog</DialogTitle>
                    <DialogDescription>Each size keeps the same behavior contract.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>The size prop only changes content width.</DialogBody>
                  <DialogFooter>
                    <DialogClose>
                      {#snippet button(props)}
                        <Button onclick={props.onclick}>Close</Button>
                      {/snippet}
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          {/each}
        </div>
      </Card>

      <Card title="Dismiss" description="Overlay pointer dismissal can be disabled.">
        <div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Dialog closeOnOverlayPointer={false}>
            <DialogTrigger>
              {#snippet children(slot)}
                <Button
                  action={slot.action}
                  aria-controls={slot.props['aria-controls']}
                  aria-expanded={slot.props['aria-expanded']}
                  aria-haspopup={slot.props['aria-haspopup']}
                  data-state={slot.props['data-state']}
                  onclick={slot.props.onclick}
                  variant="outline"
                >No overlay close</Button>
              {/snippet}
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogClose class={iconCloseClass} aria-label="Close">&times;</DialogClose>
                <DialogHeader>
                  <DialogTitle>Explicit close</DialogTitle>
                  <DialogDescription>Clicking the overlay does not close this dialog.</DialogDescription>
                </DialogHeader>
                <DialogBody>Use the footer actions or Escape to close.</DialogBody>
                <DialogFooter>
                  <DialogClose>
                    {#snippet button(props)}
                      <Button onclick={props.onclick} variant="outline">Cancel</Button>
                    {/snippet}
                  </DialogClose>
                  <DialogClose>
                    {#snippet button(props)}
                      <Button onclick={props.onclick}>Confirm</Button>
                    {/snippet}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      </Card>
    </div>
  </div>
</main>
