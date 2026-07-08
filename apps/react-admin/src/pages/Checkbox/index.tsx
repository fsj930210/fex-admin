import { CheckboxRoot } from '@fex/components-react/primitive/checkbox'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox, CheckboxGroup, type CheckboxCheckedState } from '@fex/components-react/ui/checkbox'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { Link } from 'react-router'

const permissionOptions = [
  { label: 'Read records', value: 'read' },
  { label: 'Create records', value: 'create' },
  { label: 'Export data', value: 'export' },
] as const

type PermissionValue = (typeof permissionOptions)[number]['value']

function DemoSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card title={title} description={description}>
      <div className="grid min-w-0 gap-space-md">{children}</div>
    </Card>
  )
}

function CheckboxRow({
  children,
  ...props
}: Omit<ComponentProps<typeof Checkbox>, 'children'> & { children: ReactNode }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 text-sm text-foreground has-disabled:opacity-60">
      <Checkbox {...props} />
      <span className="min-w-0 leading-5">{children}</span>
    </div>
  )
}

function nextValues(
  current: PermissionValue[],
  value: PermissionValue,
  checked: CheckboxCheckedState,
) {
  if (checked === true) {
    return current.includes(value) ? current : [...current, value]
  }

  return current.filter((item) => item !== value)
}

export function CheckboxPage() {
  const [controlled, setControlled] = useState<CheckboxCheckedState>(false)
  const [partialValue, setPartialValue] = useState<PermissionValue[]>(['read'])
  const [permissions, setPermissions] = useState<PermissionValue[]>(['read'])

  const permissionValues = permissionOptions.map((option) => option.value)
  const allChecked = partialValue.length === permissionValues.length
  const partialChecked = partialValue.length > 0 && !allChecked

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Checkbox</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Boolean checks, grouped layouts, indeterminate state, disabled state, and aria-invalid styling.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <DemoSection title="Primitive" description="Self-owned checkbox primitive exported as low-level parts.">
            <CheckboxRoot defaultChecked aria-label="Primitive checkbox" />
          </DemoSection>

          <DemoSection title="Basic" description="Default UI wrapper with native data and aria attributes.">
            <CheckboxRow defaultChecked value="enabled" data-demo="basic">
              Enable notifications
            </CheckboxRow>
            <CheckboxRow aria-invalid>Invalid style from aria-invalid</CheckboxRow>
          </DemoSection>

          <DemoSection title="Controlled" description="Controlled state uses checked and onCheckedChange.">
            <CheckboxRow checked={controlled} onCheckedChange={setControlled}>
              Controlled checkbox
            </CheckboxRow>
            <p className="text-sm text-muted-foreground">Current value: {String(controlled)}</p>
          </DemoSection>

          <DemoSection title="Indeterminate" description="Compose check-all behavior from normal events.">
            <CheckboxRow
              checked={partialChecked ? 'indeterminate' : allChecked}
              onCheckedChange={(checked) => {
                setPartialValue(checked === true ? permissionValues : [])
              }}
            >
              Check all permissions
            </CheckboxRow>
            <CheckboxGroup>
              {permissionOptions.map((option) => (
                <CheckboxRow
                  key={option.value}
                  checked={partialValue.includes(option.value)}
                  onCheckedChange={(checked) => {
                    setPartialValue((current) => nextValues(current, option.value, checked))
                  }}
                >
                  {option.label}
                </CheckboxRow>
              ))}
            </CheckboxGroup>
          </DemoSection>

          <DemoSection title="Group" description="CheckboxGroup is a layout wrapper; value arrays stay in the caller.">
            <CheckboxGroup orientation="horizontal">
              {permissionOptions.map((option) => (
                <CheckboxRow
                  key={option.value}
                  checked={permissions.includes(option.value)}
                  onCheckedChange={(checked) => {
                    setPermissions((current) => nextValues(current, option.value, checked))
                  }}
                >
                  {option.label}
                </CheckboxRow>
              ))}
            </CheckboxGroup>
            <p className="text-sm text-muted-foreground">Selected: {permissions.join(', ') || 'none'}</p>
          </DemoSection>

          <DemoSection title="Indicator" description="Indicator content can be supplied by the caller.">
            <div className="inline-flex min-w-0 items-center gap-2 text-sm text-foreground">
              <Checkbox defaultChecked>
                <span className="text-[10px] leading-none">OK</span>
              </Checkbox>
              <span className="min-w-0 leading-5">Custom indicator</span>
            </div>
            <CheckboxRow checked="indeterminate" onCheckedChange={() => {}}>
              Indeterminate indicator
            </CheckboxRow>
          </DemoSection>

          <DemoSection title="Disabled" description="Disabled state comes from the Root disabled prop.">
            <CheckboxGroup>
              <CheckboxRow disabled>Disabled unchecked</CheckboxRow>
              <CheckboxRow disabled defaultChecked>
                Disabled checked
              </CheckboxRow>
            </CheckboxGroup>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
