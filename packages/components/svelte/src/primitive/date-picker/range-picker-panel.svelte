<script lang="ts">
  import type { CalendarDate } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import DatePickerPanel from './date-picker-panel.svelte'

  let { class: className, panelViewDate, children }: { class?: string; panelViewDate?: CalendarDate; children?: Snippet } = $props()
</script>

{#if children}
  <DatePickerPanel range class={className} {panelViewDate}>
    {@render children()}
  </DatePickerPanel>
{:else}
  <DatePickerPanel range class={className} {panelViewDate} />
{/if}
