import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { ControlledDemo } from './controlled-demo'
import { CustomDemo } from './custom-demo'
import { RemoteDemo } from './remote-demo'

export function AutoCompletePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <h1 className="text-2xl font-semibold text-foreground">AutoComplete</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Free text input with optional local or remote suggestions. Selection metadata preserves complete backend records.</p>
        </header>
        <div className="grid gap-space-xl"><BasicDemo /><ControlledDemo /><RemoteDemo /><CustomDemo /></div>
      </div>
    </main>
  )
}
