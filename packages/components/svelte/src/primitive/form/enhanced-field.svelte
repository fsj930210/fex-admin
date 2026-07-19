<script lang="ts">
  import { compileFieldRuleProps } from '@fex/components-core'
  import { onMount, tick, type Component } from 'svelte'

  let { fieldComponent: FieldComponent, form, initialValue, defaultValue, ...props }: {
    fieldComponent: Component<any>
    form: {
      getFieldValue: (name: string) => unknown
      setFieldValue: (name: string, value: unknown, options?: Record<string, boolean>) => void
      state: { values: unknown }
    }
    [key: string]: unknown
  } = $props()

  const resolvedDefaultValue = defaultValue ?? initialValue
  const fieldProps = $derived(compileFieldRuleProps(props as never, form as never))

  onMount(async () => {
    if (initialValue === undefined || defaultValue !== undefined || typeof props.name !== 'string') return
    // createForm mounts on the parent component; wait for that mount to finish before applying the field override.
    await tick()
    form.setFieldValue(props.name, initialValue, {
      dontRunListeners: true,
      dontUpdateMeta: true,
      dontValidate: true,
    })
  })

</script>

<FieldComponent {...fieldProps} defaultValue={resolvedDefaultValue} />
