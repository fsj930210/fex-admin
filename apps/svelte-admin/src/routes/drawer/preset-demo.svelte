<script lang="ts">
  import Drawer from '@fex/components-svelte/primitive/drawer'
  import DrawerBody from '@fex/components-svelte/primitive/drawer-body'
  import DrawerClose from '@fex/components-svelte/primitive/drawer-close'
  import DrawerContent from '@fex/components-svelte/primitive/drawer-content'
  import DrawerHeader from '@fex/components-svelte/primitive/drawer-header'
  import DrawerMask from '@fex/components-svelte/primitive/drawer-mask'
  import DrawerPortal from '@fex/components-svelte/primitive/drawer-portal'
  import DrawerTrigger from '@fex/components-svelte/primitive/drawer-trigger'
  import Button from '@fex/components-svelte/ui/button'
  const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
</script>

<div class="flex gap-2">{#each sizes as size}<Drawer {size}><DrawerTrigger>{#snippet children(props)}<Button {...props} variant="outline">{size}</Button>{/snippet}</DrawerTrigger><DrawerPortal><DrawerMask /><DrawerContent {size} aria-label={`${size} preset`}><DrawerHeader>{size}<DrawerClose /></DrawerHeader><DrawerBody>Preset size: {size}</DrawerBody></DrawerContent></DrawerPortal></Drawer>{/each}</div>
