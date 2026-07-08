import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerRenderProps,
} from '@fex/components-solid/primitive/dialog'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For, createSignal, type JSX } from 'solid-js'

const iconCloseClass =
  'absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

function TriggerButton(props: { slot: DialogTriggerRenderProps; variant?: 'default' | 'outline'; children: JSX.Element }) {
  return <Button {...props.slot.props} ref={(element) => props.slot.ref(element)} variant={props.variant}>{props.children}</Button>
}

function Panel(props: { title: string; description: string; children: JSX.Element; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContent size={props.size}>
        <DialogClose class={iconCloseClass} aria-label="Close">&times;</DialogClose>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <DialogBody>{props.children}</DialogBody>
        <DialogFooter>
          <DialogClose>{(closeProps) => <Button {...closeProps} variant="outline">Cancel</Button>}</DialogClose>
          <DialogClose>{(closeProps) => <Button {...closeProps}>Confirm</Button>}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  )
}

export function DialogPage() {
  const [open, setOpen] = createSignal(false)
  const sizes = ['sm', 'md', 'lg'] as const
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Dialog</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Primitive modal composition backed by the shared core overlay controller.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <Card title="Primitive" description="Trigger exposes render props and content owns ARIA labels.">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <Dialog>
                <DialogTrigger>{(slot) => <TriggerButton slot={slot}>Open dialog</TriggerButton>}</DialogTrigger>
                <Panel title="Archive record" description="Review the record before archiving it.">
                  The shared controller handles open state, mounted phase, Escape, and top-layer dismiss.
                </Panel>
              </Dialog>
            </div>
          </Card>
          <Card title="Controlled" description="Controlled mode requests updates through onOpenChange.">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <Dialog open={open()} onOpenChange={setOpen}>
                <DialogTrigger>{(slot) => <TriggerButton slot={slot} variant="outline">{open() ? 'Open' : 'Closed'}</TriggerButton>}</DialogTrigger>
                <Panel title="Controlled dialog" description="The parent owns the open state.">
                  Overlay click and Escape request closing through the controlled callback.
                </Panel>
              </Dialog>
            </div>
          </Card>
          <Card title="Sizes" description="Content size is a primitive style variant.">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <For each={sizes}>{(size) => (
                <Dialog>
                  <DialogTrigger>{(slot) => <TriggerButton slot={slot} variant="outline">{size}</TriggerButton>}</DialogTrigger>
                  <Panel size={size} title={`${size} dialog`} description="Each size keeps the same behavior contract.">
                    The size prop only changes content width.
                  </Panel>
                </Dialog>
              )}</For>
            </div>
          </Card>
          <Card title="Dismiss" description="Overlay pointer dismissal can be disabled.">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <Dialog closeOnOverlayPointer={false}>
                <DialogTrigger>{(slot) => <TriggerButton slot={slot} variant="outline">No overlay close</TriggerButton>}</DialogTrigger>
                <Panel title="Explicit close" description="Clicking the overlay does not close this dialog.">
                  Use the footer actions or Escape to close.
                </Panel>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
