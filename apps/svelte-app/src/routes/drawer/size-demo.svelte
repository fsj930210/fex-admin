<script lang="ts">
  import type { DrawerPlacement } from '@fex-design/core/drawer/types'
  import Drawer from '@fex-design/svelte/primitive/drawer'
  import DrawerTrigger from '@fex-design/svelte/primitive/drawer-trigger'
  import DrawerPortal from '@fex-design/svelte/primitive/drawer-portal'
  import DrawerMask from '@fex-design/svelte/primitive/drawer-mask'
  import DrawerContent from '@fex-design/svelte/primitive/drawer-content'
  import DrawerResizeHandle from '@fex-design/svelte/primitive/drawer-resize-handle'
  import DrawerHeader from '@fex-design/svelte/primitive/drawer-header'
  import DrawerBody from '@fex-design/svelte/primitive/drawer-body'
  import DrawerClose from '@fex-design/svelte/primitive/drawer-close'
  import Radio from '@fex-design/svelte/primitive/radio'
  import RadioGroup from '@fex-design/svelte/primitive/radio-group'
  import Button from '@fex-design/svelte/ui/button'
  const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left']
  let placement: DrawerPlacement = 'right'
  let size = 400
</script>

<div class="space-y-3">
  <RadioGroup value={placement} orientation="horizontal" onValueChange={(value) => placement = value as DrawerPlacement}>
    {#each placements as item}<label class="inline-flex items-center gap-2 text-sm text-foreground"><Radio value={item} /><span>{item}</span></label>{/each}
  </RadioGroup>
  <Drawer {placement} {size} resizable onSizeChange={(value) => size = value}><DrawerTrigger>{#snippet children(props)}<Button {...props}>Resizable {placement} ({Math.round(size)}px)</Button>{/snippet}</DrawerTrigger><DrawerPortal><DrawerMask/><DrawerContent aria-label="Resizable drawer"><DrawerResizeHandle /><DrawerHeader>Resizable {placement} drawer<DrawerClose /></DrawerHeader><DrawerBody>Drag the inner edge to change {placement === 'left' || placement === 'right' ? 'width' : 'height'}.</DrawerBody></DrawerContent></DrawerPortal></Drawer>
</div>
