import { Link } from 'react-router'
import { CustomIconDemo } from './custom-icon-demo'
import { FractionDemo } from './fraction-demo'
import { IntegerDemo } from './integer-demo'

export function RatePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Rate</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              A rating primitive with configurable interaction precision and arbitrary fractional
              display.
            </p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <IntegerDemo />
          <FractionDemo />
          <CustomIconDemo />
        </div>
      </div>
    </main>
  )
}
