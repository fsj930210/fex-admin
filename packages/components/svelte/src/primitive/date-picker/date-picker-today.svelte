<script lang="ts">
  import { getCalendarToday } from '@fex/components-core/calendar'
  import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
  import { datePickerTodayClassName } from '@fex/components-styles/date-picker'
  import type { Snippet } from 'svelte'
  import Button from '../button/button.svelte'
  import { useFooterOwner } from './date-picker-footer.svelte'
  interface Props { children?: Snippet }
  let { children }: Props = $props()
  const owner = useFooterOwner()
  function today() {
    owner.setViewDate(getCalendarToday())
    owner.setPanel(getDefaultPanelByPicker(owner.picker))
  }
</script>

<Button data-slot="date-picker-today" class={datePickerTodayClassName} onclick={today}>
  {#if children}{@render children()}{:else}今天{/if}
</Button>
