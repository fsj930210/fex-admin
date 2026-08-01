<script lang="ts">
  import type { DrawerPlacement } from '@fex/components-core/drawer/types'
  import Drawer from '@fex/components-svelte/primitive/drawer'
  import DrawerBody from '@fex/components-svelte/primitive/drawer-body'
  import DrawerClose from '@fex/components-svelte/primitive/drawer-close'
  import DrawerContent from '@fex/components-svelte/primitive/drawer-content'
  import DrawerHeader from '@fex/components-svelte/primitive/drawer-header'
  import DrawerMask from '@fex/components-svelte/primitive/drawer-mask'
  import DrawerPortal from '@fex/components-svelte/primitive/drawer-portal'
  import DrawerTrigger from '@fex/components-svelte/primitive/drawer-trigger'
  import Radio from '@fex/components-svelte/primitive/radio'
  import RadioGroup from '@fex/components-svelte/primitive/radio-group'
  import Button from '@fex/components-svelte/ui/button'
  const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left']
  let placement: DrawerPlacement = 'right'
</script>

<div class="space-y-3">
  <RadioGroup value={placement} orientation="horizontal" onValueChange={(value) => placement = value as DrawerPlacement}>
    {#each placements as item}<label class="inline-flex items-center gap-2 text-sm text-foreground"><Radio value={item} /><span>{item}</span></label>{/each}
  </RadioGroup>
  <Drawer {placement}><DrawerTrigger>{#snippet children(props)}<Button {...props}>Open {placement}</Button>{/snippet}</DrawerTrigger><DrawerPortal><DrawerMask /><DrawerContent aria-label={`${placement} drawer`}><DrawerHeader>{placement} drawer<DrawerClose /></DrawerHeader><DrawerBody>Placement is controlled by the parent.</DrawerBody></DrawerContent></DrawerPortal></Drawer>
</div>
