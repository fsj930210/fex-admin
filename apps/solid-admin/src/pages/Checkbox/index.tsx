import { CheckboxRoot } from '@fex/components-solid/primitive/checkbox'
import { Card } from '@fex/components-solid/ui/card'
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxCheckedState,
} from '@fex/components-solid/ui/checkbox'
import { For, createMemo, createSignal, type JSX } from 'solid-js'
import { A } from '@solidjs/router'

const options = [
  { label: 'Read records', value: 'read' },
  { label: 'Create records', value: 'create' },
  { label: 'Export data', value: 'export' },
] as const
type PermissionValue = (typeof options)[number]['value']

function DemoSection(props: { title: string; description: string; children: JSX.Element }) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="grid min-w-0 gap-space-md">{props.children}</div>
    </Card>
  )
}

function nextValues(
  current: PermissionValue[],
  value: PermissionValue,
  checked: CheckboxCheckedState,
) {
  return checked === true
    ? current.includes(value)
      ? current
      : [...current, value]
    : current.filter((item) => item !== value)
}

export function CheckboxPage() {
  const [controlled, setControlled] = createSignal<CheckboxCheckedState>(false)
  const [partialValue, setPartialValue] = createSignal<PermissionValue[]>(['read'])
  const [permissions, setPermissions] = createSignal<PermissionValue[]>(['read'])
  const optionValues = options.map((option) => option.value)
  const allChecked = createMemo(() => partialValue().length === optionValues.length)
  const partialChecked = createMemo(() => partialValue().length > 0 && !allChecked())

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Checkbox</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Boolean checks, grouped layouts, indeterminate state, disabled state, and aria-invalid
              styling.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <DemoSection
            title="Primitive"
            description="Self-owned checkbox primitive exported as low-level parts."
          >
            <CheckboxRoot defaultChecked aria-label="Primitive checkbox" />
          </DemoSection>
          <DemoSection
            title="Basic"
            description="Default UI wrapper with native data and aria attributes."
          >
            <div class="inline-flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              <span>Enable notifications</span>
            </div>
            <div class="inline-flex items-center gap-2 text-sm">
              <Checkbox aria-invalid />
              <span>Invalid style from aria-invalid</span>
            </div>
          </DemoSection>
          <DemoSection
            title="Controlled"
            description="Controlled state uses checked and onCheckedChange."
          >
            <div class="inline-flex items-center gap-2 text-sm">
              <Checkbox checked={controlled()} onCheckedChange={setControlled} />
              <span>Controlled checkbox</span>
            </div>
            <p class="text-sm text-muted-foreground">Current value: {String(controlled())}</p>
          </DemoSection>
          <DemoSection
            title="Indeterminate"
            description="Compose check-all behavior from normal events."
          >
            <div class="inline-flex items-center gap-2 text-sm">
              <Checkbox
                checked={partialChecked() ? 'indeterminate' : allChecked()}
                onCheckedChange={(checked) => setPartialValue(checked === true ? optionValues : [])}
              />
              <span>Check all permissions</span>
            </div>
            <CheckboxGroup>
              <For each={options}>
                {(option) => (
                  <div class="inline-flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={partialValue().includes(option.value)}
                      onCheckedChange={(checked) =>
                        setPartialValue((current) => nextValues(current, option.value, checked))
                      }
                    />
                    <span>{option.label}</span>
                  </div>
                )}
              </For>
            </CheckboxGroup>
          </DemoSection>
          <DemoSection
            title="Group"
            description="CheckboxGroup is a layout wrapper; value arrays stay in the caller."
          >
            <CheckboxGroup orientation="horizontal">
              <For each={options}>
                {(option) => (
                  <div class="inline-flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={permissions().includes(option.value)}
                      onCheckedChange={(checked) =>
                        setPermissions((current) => nextValues(current, option.value, checked))
                      }
                    />
                    <span>{option.label}</span>
                  </div>
                )}
              </For>
            </CheckboxGroup>
            <p class="text-sm text-muted-foreground">
              Selected: {permissions().join(', ') || 'none'}
            </p>
          </DemoSection>
          <DemoSection
            title="Disabled"
            description="Disabled state comes from the Root disabled prop."
          >
            <CheckboxGroup>
              <div class="inline-flex items-center gap-2 text-sm">
                <Checkbox disabled />
                <span>Disabled unchecked</span>
              </div>
              <div class="inline-flex items-center gap-2 text-sm">
                <Checkbox disabled defaultChecked />
                <span>Disabled checked</span>
              </div>
            </CheckboxGroup>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
