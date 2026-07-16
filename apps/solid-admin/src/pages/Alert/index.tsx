import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@fex/components-solid/primitive/alert'
import { Badge } from '@fex/components-solid/ui/badge'
import { InfoIcon } from '@fex/components-solid/icon/info'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

const variants = ['default', 'success', 'warning', 'destructive'] as const

export function AlertPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <h1 class="text-2xl font-semibold text-foreground">Alert</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
            Show status messages with clear semantics.
          </p>
        </header>
        <Card title="Primitive" description="Structure with icon, title, description, and action.">
          <div class="grid gap-space-md">
            <For each={variants}>
              {(variant) => (
                <Alert variant={variant}>
                  <InfoIcon />
                  <AlertTitle>{variant}</AlertTitle>
                  <AlertDescription>
                    The current task is in {variant} state. Continue with the page action.
                  </AlertDescription>
                  <AlertAction>
                    <Badge variant="outline">New</Badge>
                  </AlertAction>
                </Alert>
              )}
            </For>
          </div>
        </Card>
      </div>
    </main>
  )
}
