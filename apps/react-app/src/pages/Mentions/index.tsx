import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { CustomTriggerDemo } from './custom-trigger-demo'
import { ParamsDemo } from './params-demo'
import { PrefixDemo } from './prefix-demo'
import { ValidationDemo } from './validation-demo'

export function MentionsPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Mentions primitive</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Mention primitives identify prefix queries, render caller-owned items, and notify
            selection without forcing text replacement.
          </p>
        </header>
        <div className="grid gap-space-xl">
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
