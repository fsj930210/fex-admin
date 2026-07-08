import { Dialog } from '@fex/components-react/primitive/dialog'
import { CloseIcon } from '@fex/components-react/icon/close'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

function DemoSection(props: { title: string; description: string; children: ReactNode }) {
  return (
    <Card title={props.title} description={props.description}>
      <div className="flex min-w-0 flex-wrap items-center gap-space-md">{props.children}</div>
    </Card>
  )
}

const iconCloseClassName =
  'absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

function DialogPanel(props: { title: string; description: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content size={props.size}>
        <Dialog.Close className={iconCloseClassName} aria-label="Close">
          <CloseIcon className="size-4" />
        </Dialog.Close>
        <Dialog.Header>
          <Dialog.Title>{props.title}</Dialog.Title>
          <Dialog.Description>{props.description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>{props.children}</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>
            {(closeProps) => <Button {...closeProps} variant="outline">Cancel</Button>}
          </Dialog.Close>
          <Dialog.Close>
            {(closeProps) => <Button {...closeProps}>Confirm</Button>}
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export function DialogPage() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dialog</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Primitive modal composition backed by the shared core overlay controller.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <DemoSection title="Primitive" description="Trigger exposes render props and content owns ARIA labels.">
            <Dialog.Root>
              <Dialog.Trigger>{(props) => <Button {...props}>Open dialog</Button>}</Dialog.Trigger>
              <DialogPanel title="Archive record" description="Review the record before archiving it.">
                The shared controller handles open state, mounted phase, Escape, and top-layer dismiss.
              </DialogPanel>
            </Dialog.Root>
          </DemoSection>

          <DemoSection title="Controlled" description="Controlled mode requests updates through onOpenChange.">
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger>{(props) => <Button {...props} variant={open ? 'secondary' : 'outline'}>{open ? 'Open' : 'Closed'}</Button>}</Dialog.Trigger>
              <DialogPanel title="Controlled dialog" description="The parent owns the open state.">
                Overlay click and Escape request closing through the controlled callback.
              </DialogPanel>
            </Dialog.Root>
          </DemoSection>

          <DemoSection title="Sizes" description="Content size is a primitive style variant.">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Dialog.Root key={size}>
                <Dialog.Trigger>{(props) => <Button {...props} variant="outline">{size}</Button>}</Dialog.Trigger>
                <DialogPanel size={size} title={`${size} dialog`} description="Each size keeps the same behavior contract.">
                  The size prop only changes content width.
                </DialogPanel>
              </Dialog.Root>
            ))}
          </DemoSection>

          <DemoSection title="Dismiss" description="Overlay pointer dismissal can be disabled.">
            <Dialog.Root closeOnOverlayPointer={false}>
              <Dialog.Trigger>{(props) => <Button {...props} variant="outline">No overlay close</Button>}</Dialog.Trigger>
              <DialogPanel title="Explicit close" description="Clicking the overlay does not close this dialog.">
                Use the footer actions or Escape to close.
              </DialogPanel>
            </Dialog.Root>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
