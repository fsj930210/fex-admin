import { A } from '@solidjs/router'
import { BasicDemo } from './basic-demo'
import { CustomTriggerDemo } from './custom-trigger-demo'
import { ParamsDemo } from './params-demo'
import { PrefixDemo } from './prefix-demo'
import { ValidationDemo } from './validation-demo'

export function MentionsPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <h1 class="text-2xl font-semibold text-foreground">Mentions primitive</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
            Mention primitives identify prefix queries, render caller-owned items, and notify selection.
          </p>
        </header>
        <div class="grid gap-space-xl">
          <BasicDemo />
          <PrefixDemo />
          <ParamsDemo />
          <CustomTriggerDemo />
          <ValidationDemo />
        </div>
      </div>
    </main>
  )
}
