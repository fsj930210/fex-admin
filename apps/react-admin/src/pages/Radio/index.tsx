import { Radio, RadioButton, RadioGroup, type RadioValue } from '@fex/components-react/primitive/radio'
import { Card } from '@fex/components-react/ui/card'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
] as const

function DemoSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card title={title} description={description}>
      <div className="grid min-w-0 gap-space-md">{children}</div>
    </Card>
  )
}

function RadioRow({ value, children, disabled }: { value: RadioValue; children: ReactNode; disabled?: boolean }) {
  return (
    <label className="inline-flex min-w-0 items-center gap-2 text-sm text-foreground has-disabled:opacity-60">
      <Radio value={value} disabled={disabled} />
      <span className="min-w-0 leading-5">{children}</span>
    </label>
  )
}

export function RadioPage() {
  const [controlled, setControlled] = useState<RadioValue>('pear')
  const [groupValue, setGroupValue] = useState<RadioValue>('orange')
  const [buttonValue, setButtonValue] = useState<RadioValue>('apple')

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Radio</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Single-value radio group with native aria state and button-style radio options.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <DemoSection title="Basic" description="RadioGroup owns one selected value.">
            <RadioGroup defaultValue="apple" orientation="horizontal">
              {options.map((option) => (
                <RadioRow key={option.value} value={option.value}>
                  {option.label}
                </RadioRow>
              ))}
            </RadioGroup>
          </DemoSection>

          <DemoSection title="Controlled" description="Controlled state uses value and onValueChange.">
            <RadioGroup value={controlled} onValueChange={setControlled} orientation="horizontal">
              {options.map((option) => (
                <RadioRow key={option.value} value={option.value}>
                  {option.label}
                </RadioRow>
              ))}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Current value: {controlled}</p>
          </DemoSection>

          <DemoSection title="Group" description="Vertical group layout still uses one selected value.">
            <RadioGroup value={groupValue} onValueChange={setGroupValue}>
              {options.map((option) => (
                <RadioRow key={option.value} value={option.value}>
                  {option.label}
                </RadioRow>
              ))}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Selected: {groupValue}</p>
          </DemoSection>

          <DemoSection title="RadioButton" description="Button-form radios share the same RadioGroup value.">
            <RadioGroup
              value={buttonValue}
              onValueChange={setButtonValue}
              orientation="horizontal"
              className="grid grid-cols-3 gap-0"
            >
              {options.map((option) => (
                <RadioButton key={option.value} value={option.value}>
                  {option.label}
                </RadioButton>
              ))}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Current value: {buttonValue}</p>
          </DemoSection>

          <DemoSection title="Disabled" description="Disabled state can live on the group or a single radio.">
            <RadioGroup defaultValue="pear" orientation="horizontal">
              <RadioRow value="apple">Apple</RadioRow>
              <RadioRow value="pear">Pear</RadioRow>
              <RadioRow value="orange" disabled>
                Orange disabled
              </RadioRow>
            </RadioGroup>
            <RadioGroup defaultValue="apple" disabled orientation="horizontal" className="grid grid-cols-3 gap-0">
              {options.map((option) => (
                <RadioButton key={option.value} value={option.value}>
                  {option.label}
                </RadioButton>
              ))}
            </RadioGroup>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
