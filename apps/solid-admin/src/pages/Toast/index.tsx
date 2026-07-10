import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  toast,
} from '@fex/components-solid/primitive/toast'
import { CheckIcon } from '@fex/components-solid/icon/check'
import { CloseIcon } from '@fex/components-solid/icon/close'
import { ErrorIcon } from '@fex/components-solid/icon/error'
import { InfoIcon } from '@fex/components-solid/icon/info'
import { LoadingIcon } from '@fex/components-solid/icon/loading'
import { WarningIcon } from '@fex/components-solid/icon/warning'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For, Show, createSignal } from 'solid-js'
import type { JSX } from 'solid-js'

type ToastPlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

const placements: ToastPlacement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']

export function ToastPage() {
  const [placement, setPlacement] = createSignal<ToastPlacement>('top')
  const [stack, setStack] = createSignal(false)
  const [manualId, setManualId] = createSignal<string | null>(null)

  function showManyMessages() {
    for (let index = 1; index <= 6; index += 1) {
      toast.info({
        title: `Message ${index}: ${index % 2 === 0 ? 'This is a slightly longer stacked message.' : 'This is a stacked message.'}`,
        duration: 5000,
      })
    }
  }

  function showManualToast() {
    setManualId(toast.loading({ title: 'Uploading report', description: 'This toast stays until it is dismissed manually.', duration: -1 }))
  }

  function toggleStack() {
    const nextStack = !stack()
    toast.configure({ max: nextStack ? -1 : 5 })
    setStack(nextStack)
  }

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-6xl space-y-space-lg">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <h1 class="text-2xl font-semibold text-foreground">Toast</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">Primitive global feedback with quick calls, custom content, position, max count, manual destroy, stable id updates, and stacked display.</p>
        </header>

        <DemoSection title="Types" description="Built-in variants only provide default semantics. Content and icon can still be customized.">
          <Button variant="outline" onClick={() => toast.show('Hello, Fex Design!')}>Default</Button>
          <Button variant="outline" onClick={() => toast.success('This is a success message')}>Success</Button>
          <Button variant="outline" onClick={() => toast.info('This is an info message')}>Info</Button>
          <Button variant="outline" onClick={() => toast.warning('This is a warning message')}>Warning</Button>
          <Button variant="outline" onClick={() => toast.error('This is an error message')}>Error</Button>
          <Button variant="outline" onClick={() => toast.loading({ title: 'Loading data', duration: 2500 })}>Loading</Button>
        </DemoSection>

        <DemoSection title="Position" description="The viewport controls placement. Service calls do not need to know where the toast appears.">
          <For each={placements}>{(item) => (
            <Button
              variant={placement() === item ? 'default' : 'outline'}
              onClick={() => choosePlacement(item, setPlacement)}
            >
              {labelPlacement(item)}
            </Button>
          )}</For>
        </DemoSection>

        <DemoSection title="Custom Content" description="Primitive parts let callers replace icon, add description, and render an action without changing the manager.">
          <Button variant="outline" onClick={() => toast.success({ title: 'Event has been created', description: 'Monday, January 3rd at 6:00pm', icon: <CheckIcon class="size-4" /> })}>Rich content</Button>
          <Button variant="outline" onClick={() => toast.show({ title: 'Event has been created', description: 'Sunday, December 03, 2023 at 9:00 AM', action: <Button size="sm">Undo</Button>, duration: 6000 })}>With action</Button>
        </DemoSection>

        <DemoSection title="Update And Destroy" description="A stable id updates one toast. Returned ids can be dismissed manually.">
          <Button variant="outline" onClick={() => toast.loading({ id: 'save-user', title: 'Saving user', duration: -1 })}>Open keyed loading</Button>
          <Button variant="outline" onClick={() => toast.success({ id: 'save-user', title: 'Saved user', description: 'The same id updates the existing toast.', duration: 2500 })}>Update keyed toast</Button>
          <Button variant="outline" onClick={showManualToast}>Manual toast</Button>
          <Button variant="outline" disabled={!manualId()} onClick={() => manualId() && toast.dismiss(manualId()!)}>Destroy manual</Button>
          <Button variant="outline" onClick={() => toast.clear()}>Destroy all</Button>
        </DemoSection>

        <DemoSection title="Multiple And Stacked" description="Max count limits the queue. Stack mode collapses older messages and leaves the latest visible.">
          <Button variant="outline" onClick={showManyMessages}>Show many</Button>
          <Button variant={stack() ? 'default' : 'outline'} onClick={toggleStack}>{stack() ? 'Stack on' : 'Stack off'}</Button>
        </DemoSection>
      </div>

      <ToastViewport offset={72} stack={stack()} stackThreshold={3}>
        {(items) => (
          <For each={items}>{(item) => (
            <ToastRoot toast={item}>
              <Show when={hasToastIcon(item)}><ToastIcon>{item.icon ?? iconFor(item.variant)}</ToastIcon></Show>
              <ToastTitle>{item.title}</ToastTitle>
              <ToastClose toast={item}><CloseIcon class="size-4" /></ToastClose>
              <Show when={item.description}><ToastDescription>{item.description}</ToastDescription></Show>
              <Show when={item.action}><ToastAction>{item.action}</ToastAction></Show>
            </ToastRoot>
          )}</For>
        )}
      </ToastViewport>
    </main>
  )
}

function choosePlacement(placement: ToastPlacement, setPlacement: (placement: ToastPlacement) => void) {
  setPlacement(placement)
  toast.show({
    id: 'toast-position-preview',
    placement,
    title: `Position: ${labelPlacement(placement)}`,
    duration: 2000,
  })
}

function DemoSection(props: { title: string, description: string, children: JSX.Element }) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="flex flex-wrap gap-space-sm">{props.children}</div>
    </Card>
  )
}

function iconFor(variant: string) {
  if (variant === 'success') return <CheckIcon class="size-4" />
  if (variant === 'info') return <InfoIcon class="size-4" />
  if (variant === 'warning') return <WarningIcon class="size-4" />
  if (variant === 'error') return <ErrorIcon class="size-4" />
  if (variant === 'loading') return <LoadingIcon class="size-4 animate-spin" />
  return null
}

function hasToastIcon(item: { icon?: unknown | null, variant: string }) {
  return item.icon !== null && (item.icon !== undefined || isBuiltInIconVariant(item.variant))
}

function isBuiltInIconVariant(variant: string) {
  return variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
}

function labelPlacement(placement: ToastPlacement) {
  return placement.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
