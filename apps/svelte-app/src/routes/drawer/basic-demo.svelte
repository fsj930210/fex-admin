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
</script>

<Drawer>
  <DrawerTrigger>{#snippet children(props)}<Button {...props}>Open drawer</Button>{/snippet}</DrawerTrigger>
  <DrawerPortal><DrawerMask /><DrawerContent aria-label="Basic drawer"><DrawerHeader>Basic drawer<DrawerClose /></DrawerHeader><DrawerBody>Drawer content is composed from independent primitives.</DrawerBody></DrawerContent></DrawerPortal>
</Drawer>
