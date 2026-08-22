import { A } from '@solidjs/router'
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
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header>
          <A href="/">Back home</A>
          <h1 class="text-2xl font-semibold">InputNumber primitive</h1>
        </header>
        <div class="grid gap-space-xl">
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
