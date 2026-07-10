import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  toast,
  type ReactToastItem,
} from '@fex/components-react/primitive/toast'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { CheckIcon } from '@fex/components-react/icon/check'
import { CloseIcon } from '@fex/components-react/icon/close'
import { ErrorIcon } from '@fex/components-react/icon/error'
import { InfoIcon } from '@fex/components-react/icon/info'
import { LoadingIcon } from '@fex/components-react/icon/loading'
import { WarningIcon } from '@fex/components-react/icon/warning'
import { useState } from 'react'
import { Link } from 'react-router'

type ToastPlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

const placements: ToastPlacement[] = [
  'top-left',
  'top',
  'top-right',
  'bottom-left',
  'bottom',
  'bottom-right',
]

export function ToastPage() {
  const [placement, setPlacement] = useState<ToastPlacement>('top')
  const [stack, setStack] = useState(false)
  const [manualId, setManualId] = useState<string | null>(null)

  function showManyMessages() {
    for (let index = 1; index <= 6; index += 1) {
      toast.info({
        title: `Message ${index}: ${index % 2 === 0 ? 'This is a slightly longer stacked message.' : 'This is a stacked message.'}`,
        duration: 5000,
      })
    }
  }

  function showManualToast() {
    const id = toast.loading({
      title: 'Uploading report',
      description: 'This toast stays until it is dismissed manually.',
      duration: -1,
    })
    setManualId(id)
  }

  function toggleStack() {
    const nextStack = !stack
    toast.configure({ max: nextStack ? -1 : 5 })
    setStack(nextStack)
  }

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-6xl space-y-space-lg">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Toast</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Primitive global feedback with quick calls, custom content, position, max count, manual
            destroy, stable id updates, and stacked display.
          </p>
        </header>

        <Card
          title="Types"
          description="Built-in variants only provide default semantics. Content and icon can still be customized."
        >
          <div className="flex flex-wrap gap-space-sm">
            <Button variant="outline" onClick={() => toast.show('Hello, Fex Design!')}>
              Default
            </Button>
            <Button variant="outline" onClick={() => toast.success('This is a success message')}>
              Success
            </Button>
            <Button variant="outline" onClick={() => toast.info('This is an info message')}>
              Info
            </Button>
            <Button variant="outline" onClick={() => toast.warning('This is a warning message')}>
              Warning
            </Button>
            <Button variant="outline" onClick={() => toast.error('This is an error message')}>
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.loading({ title: 'Loading data', duration: 2500 })}
            >
              Loading
            </Button>
          </div>
        </Card>

        <Card
          title="Position"
          description="The viewport controls placement. Service calls do not need to know where the toast appears."
        >
          <div className="flex flex-wrap gap-space-sm">
            {placements.map((item) => (
              <Button
                key={item}
                variant={placement === item ? 'default' : 'outline'}
                onClick={() => choosePlacement(item, setPlacement)}
              >
                {labelPlacement(item)}
              </Button>
            ))}
          </div>
        </Card>

        <Card
          title="Custom Content"
          description="Primitive parts let callers replace icon, add description, and render an action without changing the manager."
        >
          <div className="flex flex-wrap gap-space-sm">
            <Button
              variant="outline"
              onClick={() =>
                toast.success({
                  title: 'Event has been created',
                  description: 'Monday, January 3rd at 6:00pm',
                  icon: <CheckIcon className="size-4" />,
                })
              }
            >
              Rich content
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.show({
                  title: 'Event has been created',
                  description: 'Sunday, December 03, 2023 at 9:00 AM',
                  action: <Button size="sm">Undo</Button>,
                  duration: 6000,
                })
              }
            >
              With action
            </Button>
          </div>
        </Card>

        <Card
          title="Update And Destroy"
          description="A stable id updates one toast. Returned ids can be dismissed manually."
        >
          <div className="flex flex-wrap gap-space-sm">
            <Button
              variant="outline"
              onClick={() => toast.loading({ id: 'save-user', title: 'Saving user', duration: -1 })}
            >
              Open keyed loading
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success({
                  id: 'save-user',
                  title: 'Saved user',
                  description: 'The same id updates the existing toast.',
                  duration: 2500,
                })
              }
            >
              Update keyed toast
            </Button>
            <Button variant="outline" onClick={showManualToast}>
              Manual toast
            </Button>
            <Button
              variant="outline"
              onClick={() => manualId && toast.dismiss(manualId)}
              disabled={!manualId}
            >
              Destroy manual
            </Button>
            <Button variant="outline" onClick={() => toast.clear()}>
              Destroy all
            </Button>
          </div>
        </Card>

        <Card
          title="Multiple And Stacked"
          description="Max count limits the queue. Stack mode collapses older messages and leaves the latest visible."
        >
          <div className="flex flex-wrap gap-space-sm">
            <Button variant="outline" onClick={showManyMessages}>
              Show many
            </Button>
            <Button
              variant={stack ? 'default' : 'outline'}
              onClick={toggleStack}
            >
              {stack ? 'Stack on' : 'Stack off'}
            </Button>
          </div>
        </Card>
      </div>

      <ToastViewport
        offset={72}
        stack={stack}
        stackThreshold={3}
      >
        {(items) => items.map((item) => <ToastCard key={item.id} item={item} />)}
      </ToastViewport>
    </main>
  )
}

function choosePlacement(
  placement: ToastPlacement,
  setPlacement: (placement: ToastPlacement) => void,
) {
  setPlacement(placement)
  toast.show({
    id: 'toast-position-preview',
    placement,
    title: `Position: ${labelPlacement(placement)}`,
    duration: 2000,
  })
}

function ToastCard({ item }: { item: ReactToastItem }) {
  return (
    <ToastRoot toast={item}>
      {hasToastIcon(item) ? <ToastIcon>{item.icon ?? iconFor(item.variant)}</ToastIcon> : null}
      <ToastTitle>{item.title}</ToastTitle>
      <ToastClose toast={item}>
        <CloseIcon className="size-4" />
      </ToastClose>
      {item.description ? <ToastDescription>{item.description}</ToastDescription> : null}
      {item.action ? <ToastAction>{item.action}</ToastAction> : null}
    </ToastRoot>
  )
}

function hasToastIcon(item: ReactToastItem) {
  return item.icon !== null && (item.icon !== undefined || isBuiltInIconVariant(item.variant))
}

function isBuiltInIconVariant(variant: string) {
  return variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
}

function iconFor(variant: string) {
  if (variant === 'success') return <CheckIcon className="size-4" />
  if (variant === 'info') return <InfoIcon className="size-4" />
  if (variant === 'warning') return <WarningIcon className="size-4" />
  if (variant === 'error') return <ErrorIcon className="size-4" />
  if (variant === 'loading') return <LoadingIcon className="size-4 animate-spin" />
  return null
}

function labelPlacement(placement: ToastPlacement) {
  return placement
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
