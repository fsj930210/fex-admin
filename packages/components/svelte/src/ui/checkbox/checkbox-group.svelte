<script lang="ts">
  import { checkboxGroupClassName, type CheckboxGroupStyleProps } from '@fex/components-styles/checkbox'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import CheckboxGroupPrimitive from '../../primitive/checkbox/checkbox-group.svelte'

  interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: CheckboxGroupStyleProps['orientation']
    children?: Snippet
  }

  let { orientation = 'vertical', class: className, children, ...rest }: CheckboxGroupProps = $props()
  const classList = $derived(cn(checkboxGroupClassName({ orientation }), className))
</script>

<CheckboxGroupPrimitive
  {...rest}
  class={classList}
  data-slot="checkbox-group"
  data-orientation={orientation}
>
  {@render children?.()}
</CheckboxGroupPrimitive>
