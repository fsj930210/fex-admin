<script lang="ts">
  import { ColorPickerSwatch, useColorPicker } from '@fex-design/svelte/primitive/color-picker'
  import PopoverRoot from '@fex-design/svelte/primitive/popover'
  import PopoverContent from '@fex-design/svelte/primitive/popover-content'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import PickerPanel from './picker-panel.svelte'

  let { alpha = true, clear = false, text = false, hover = false, inline = false, oklch = false }: {
    alpha?: boolean; clear?: boolean; text?: boolean; hover?: boolean; inline?: boolean; oklch?: boolean
  } = $props()
  const picker = useColorPicker()
  const snapshot = $derived(picker.snapshot())
</script>

{#if inline}
  <PickerPanel {alpha} {clear} {oklch} />
{:else}
  <PopoverRoot trigger={hover ? ['hover'] : ['click']}>
    <PopoverTrigger>
      {#snippet children(slot)}
        <button {...slot.props} use:slot.action disabled={snapshot.disabled} data-disabled={snapshot.disabled || undefined} class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 data-disabled:cursor-not-allowed data-disabled:bg-muted-background data-disabled:opacity-50">
          <ColorPickerSwatch />
          {#if text}<span class="truncate text-sm">{snapshot.format.toUpperCase()}: {snapshot.value?.toString(snapshot.format) ?? '未选择'}</span>{/if}
        </button>
      {/snippet}
    </PopoverTrigger>
    <PopoverPortal><PopoverContent><PickerPanel {alpha} {clear} {oklch} /></PopoverContent></PopoverPortal>
  </PopoverRoot>
{/if}
