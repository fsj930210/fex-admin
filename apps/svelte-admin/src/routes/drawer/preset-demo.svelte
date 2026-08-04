<script lang="ts">
  import Drawer from '@fex-design/svelte/primitive/drawer'
  import DrawerBody from '@fex-design/svelte/primitive/drawer-body'
  import DrawerClose from '@fex-design/svelte/primitive/drawer-close'
  import DrawerContent from '@fex-design/svelte/primitive/drawer-content'
  import DrawerHeader from '@fex-design/svelte/primitive/drawer-header'
  import DrawerMask from '@fex-design/svelte/primitive/drawer-mask'
  import DrawerPortal from '@fex-design/svelte/primitive/drawer-portal'
  import DrawerTrigger from '@fex-design/svelte/primitive/drawer-trigger'
  import Button from '@fex-design/svelte/ui/button'
  const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
</script>

<div class="flex gap-2">{#each sizes as size}<Drawer {size}><DrawerTrigger>{#snippet children(props)}<Button {...props} variant="outline">{size}</Button>{/snippet}</DrawerTrigger><DrawerPortal><DrawerMask /><DrawerContent {size} aria-label={`${size} preset`}><DrawerHeader>{size}<DrawerClose /></DrawerHeader><DrawerBody>Preset size: {size}</DrawerBody></DrawerContent></DrawerPortal></Drawer>{/each}</div>
