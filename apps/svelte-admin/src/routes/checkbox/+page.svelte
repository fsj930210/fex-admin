<script lang="ts">
  import CheckboxRoot from '@fex/components-svelte/primitive/checkbox'
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import CheckboxGroup from '@fex/components-svelte/ui/checkbox-group'
  import Card from '@fex/components-svelte/ui/card'
  import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'

  const options = [
    { label: 'Read records', value: 'read' },
    { label: 'Create records', value: 'create' },
    { label: 'Export data', value: 'export' },
  ] as const

  type PermissionValue = (typeof options)[number]['value']

  let controlled: CheckboxCheckedState = $state(false)
  let partialValue: PermissionValue[] = $state(['read'])
  let permissions: PermissionValue[] = $state(['read'])
  const optionValues = options.map((option) => option.value)
  const allChecked = $derived(partialValue.length === optionValues.length)
  const partialChecked = $derived(partialValue.length > 0 && !allChecked)
  const checkAllState = $derived(partialChecked ? 'indeterminate' : allChecked)

  function nextValues(current: PermissionValue[], value: PermissionValue, checked: CheckboxCheckedState) {
    if (checked === true) {
      return current.includes(value) ? current : [...current, value]
    }
    return current.filter((item) => item !== value)
  }
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Checkbox</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Boolean checks, grouped layouts, indeterminate state, disabled state, and aria-invalid styling.
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Primitive" description="Self-owned checkbox primitive exported as low-level parts.">
        <CheckboxRoot defaultChecked aria-label="Primitive checkbox" />
      </Card>

      <Card title="Basic" description="Default UI wrapper with native data and aria attributes.">
        <div class="grid min-w-0 gap-space-md">
          <div class="inline-flex items-center gap-2 text-sm"><Checkbox defaultChecked /><span>Enable notifications</span></div>
          <div class="inline-flex items-center gap-2 text-sm"><Checkbox aria-invalid="true" /><span>Invalid style from aria-invalid</span></div>
        </div>
      </Card>

      <Card title="Controlled" description="Controlled state uses checked and onCheckedChange.">
        <div class="grid min-w-0 gap-space-md">
          <div class="inline-flex items-center gap-2 text-sm">
            <Checkbox checked={controlled} onCheckedChange={(checked) => (controlled = checked)} />
            <span>Controlled checkbox</span>
          </div>
          <p class="text-sm text-muted-foreground">Current value: {String(controlled)}</p>
        </div>
      </Card>

      <Card title="Indeterminate" description="Compose check-all behavior from normal events.">
        <div class="grid min-w-0 gap-space-md">
          <div class="inline-flex items-center gap-2 text-sm">
            <Checkbox checked={checkAllState} onCheckedChange={(checked) => (partialValue = checked === true ? optionValues : [])} />
            <span>Check all permissions</span>
          </div>
          <CheckboxGroup>
            {#each options as option}
              <div class="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={partialValue.includes(option.value)} onCheckedChange={(checked) => (partialValue = nextValues(partialValue, option.value, checked))} />
                <span>{option.label}</span>
              </div>
            {/each}
          </CheckboxGroup>
        </div>
      </Card>

      <Card title="Group" description="CheckboxGroup is a layout wrapper; value arrays stay in the caller.">
        <div class="grid min-w-0 gap-space-md">
          <CheckboxGroup orientation="horizontal">
            {#each options as option}
              <div class="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={permissions.includes(option.value)} onCheckedChange={(checked) => (permissions = nextValues(permissions, option.value, checked))} />
                <span>{option.label}</span>
              </div>
            {/each}
          </CheckboxGroup>
          <p class="text-sm text-muted-foreground">Selected: {permissions.join(', ') || 'none'}</p>
        </div>
      </Card>

      <Card title="Disabled" description="Disabled state comes from the Root disabled prop.">
        <CheckboxGroup>
          <div class="inline-flex items-center gap-2 text-sm"><Checkbox disabled /><span>Disabled unchecked</span></div>
          <div class="inline-flex items-center gap-2 text-sm"><Checkbox disabled defaultChecked /><span>Disabled checked</span></div>
        </CheckboxGroup>
      </Card>
    </div>
  </div>
</main>
