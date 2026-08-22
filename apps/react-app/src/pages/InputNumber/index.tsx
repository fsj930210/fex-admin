import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { ConstraintsDemo } from './constraints-demo'
import { CustomLogicDemo } from './custom-logic-demo'
import { FormatterDemo } from './formatter-demo'
import { KeyboardDemo } from './keyboard-demo'
import { MinMaxDemo } from './min-max-demo'
import { StatesDemo } from './states-demo'
import { SuffixDemo } from './suffix-demo'
import { ValidationDemo } from './validation-demo'

export function InputNumberPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">InputNumber primitive</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Numeric parsing, formatting and stepping composed over the existing Input primitives.
          </p>
        </header>
        <div className="grid gap-space-xl">
          <BasicDemo />
          <ConstraintsDemo />
          <MinMaxDemo />
          <FormatterDemo />
          <SuffixDemo />
          <KeyboardDemo />
          <StatesDemo />
          <ValidationDemo />
          <CustomLogicDemo />
        </div>
      </div>
    </main>
  )
}
