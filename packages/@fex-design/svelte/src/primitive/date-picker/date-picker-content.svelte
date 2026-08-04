<script lang="ts">
  import { datePickerContentClassName } from '@fex-design/styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import PopoverContent from '../popover/popover-content.svelte'
  import PopoverPortal from '../popover/popover-portal.svelte'

  let { class: className, children }: { class?: string; children?: Snippet } = $props()
</script>

<PopoverPortal>
  <PopoverContent class={cn(datePickerContentClassName, className)}>
    {@render children?.()}
  </PopoverContent>
</PopoverPortal>
