import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { AutosizeDemo } from './autosize-demo'
import { ControlledDemo } from './controlled-demo'
import { CountDemo } from './count-demo'
import { FooterDemo } from './footer-demo'

export function TextareaPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Textarea primitives</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            TextareaRoot coordinates value, autosize, clear and footer composition while
            TextareaInput remains the native textarea node.
          </p>
        </header>

        <div className="space-y-space-xl">
          <BasicDemo />
          <AutosizeDemo />
          <ControlledDemo />
          <CountDemo />
          <FooterDemo />
        </div>
      </div>
    </main>
  )
}
