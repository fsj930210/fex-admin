import { Radio, RadioButton, RadioGroup, type RadioValue } from '@fex/components-solid/primitive/radio'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For, createSignal, type JSX } from 'solid-js'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
] as const

function DemoSection(props: { title: string; description: string; children: JSX.Element }) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="grid min-w-0 gap-space-md">{props.children}</div>
    </Card>
  )
}

function RadioRow(props: { value: RadioValue; children: JSX.Element; disabled?: boolean }) {
  return (
    <label class="inline-flex min-w-0 items-center gap-2 text-sm">
      <Radio value={props.value} disabled={props.disabled} />
      <span>{props.children}</span>
    </label>
  )
}

export function RadioPage() {
  const [controlled, setControlled] = createSignal<RadioValue>('pear')
  const [groupValue, setGroupValue] = createSignal<RadioValue>('orange')
  const [buttonValue, setButtonValue] = createSignal<RadioValue>('apple')

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Radio</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Single-value radio group with native aria state and button-style radio options.
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <DemoSection title="Basic" description="RadioGroup owns one selected value.">
            <RadioGroup defaultValue="apple" orientation="horizontal">
              <For each={options}>{(option) => <RadioRow value={option.value}>{option.label}</RadioRow>}</For>
            </RadioGroup>
          </DemoSection>

          <DemoSection title="Controlled" description="Controlled state uses value and onValueChange.">
            <RadioGroup value={controlled()} onValueChange={setControlled} orientation="horizontal">
              <For each={options}>{(option) => <RadioRow value={option.value}>{option.label}</RadioRow>}</For>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Current value: {controlled()}</p>
          </DemoSection>

          <DemoSection title="Group" description="Vertical group layout still uses one selected value.">
            <RadioGroup value={groupValue()} onValueChange={setGroupValue}>
              <For each={options}>{(option) => <RadioRow value={option.value}>{option.label}</RadioRow>}</For>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Selected: {groupValue()}</p>
          </DemoSection>

          <DemoSection title="RadioButton" description="Button-form radios share the same RadioGroup value.">
            <RadioGroup value={buttonValue()} onValueChange={setButtonValue} orientation="horizontal" class="grid grid-cols-3 gap-0">
              <For each={options}>{(option) => <RadioButton value={option.value}>{option.label}</RadioButton>}</For>
            </RadioGroup>
            <p class="text-sm text-muted-foreground">Current value: {buttonValue()}</p>
          </DemoSection>

          <DemoSection title="Disabled" description="Disabled state can live on the group or a single radio.">
            <RadioGroup defaultValue="pear" orientation="horizontal">
              <RadioRow value="apple">Apple</RadioRow>
              <RadioRow value="pear">Pear</RadioRow>
              <RadioRow value="orange" disabled>Orange disabled</RadioRow>
            </RadioGroup>
            <RadioGroup defaultValue="apple" disabled orientation="horizontal" class="grid grid-cols-3 gap-0">
              <For each={options}>{(option) => <RadioButton value={option.value}>{option.label}</RadioButton>}</For>
            </RadioGroup>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
