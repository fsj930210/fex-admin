<script lang="ts">
  import { formatLinearGradient } from '@fex-design/core/gradient/gradient'
  import { ColorPickerRoot, useGradientPicker } from '@fex-design/svelte/primitive/color-picker'
  import PopoverRoot from '@fex-design/svelte/primitive/popover'
  import PopoverContent from '@fex-design/svelte/primitive/popover-content'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import GradientContent from './gradient-content.svelte'
  import PickerPanel from './picker-panel.svelte'

  const gradient = useGradientPicker()
  const snapshot = $derived(gradient.snapshot())
  const selected = $derived(snapshot.value.stops.find((stop) => stop.id === snapshot.selectedStopId))
</script>

<PopoverRoot>
  <PopoverTrigger>
    {#snippet children(slot)}
      <button {...slot.props} use:slot.action class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 text-sm">
        <span class="size-6 shrink-0 rounded" style:background={formatLinearGradient(snapshot.value)}></span>
        <span class="truncate">{snapshot.value.stops.map((stop) => `${stop.color.toString('rgb')} ${Math.round(stop.position * 100)}%`).join(', ')}</span>
      </button>
    {/snippet}
  </PopoverTrigger>
  <PopoverPortal>
    <PopoverContent>
      <ColorPickerRoot value={selected?.color} defaultFormat="rgb" onChange={(value) => value && gradient.controller.setStopColor(snapshot.selectedStopId, value)}>
        <div class="grid w-80 gap-3">
          <GradientContent />
          <PickerPanel />
        </div>
      </ColorPickerRoot>
    </PopoverContent>
  </PopoverPortal>
</PopoverRoot>
