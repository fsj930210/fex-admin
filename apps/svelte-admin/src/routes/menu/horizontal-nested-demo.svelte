<script lang="ts">
  import ChevronRightIcon from '@fex-design/svelte/icon/chevron-right'
  import { DropdownContent } from '@fex-design/svelte/primitive/dropdown'
  import { MenuItem, MenuList, MenuRoot } from '@fex-design/svelte/primitive/menu'
  import Popover from '@fex-design/svelte/primitive/popover'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import { horizontalItemClassName, horizontalListClassName, popupClassName, rootClassName, verticalItemClassName, verticalListClassName } from './demo-styles'
</script>

<MenuRoot role="navigation" aria-label="Nested navigation" class={rootClassName}>
  <MenuList orientation="horizontal" class={horizontalListClassName}>
    <MenuItem value="home" class={horizontalItemClassName}>Home</MenuItem>
    <Popover trigger={['hover', 'click']} side="bottom" align="start">
      <PopoverTrigger>{#snippet children(productsPopover)}<MenuItem value="products" submenu>{#snippet trigger(item)}<button {...item.props} {...productsPopover.props} use:productsPopover.action aria-haspopup="menu" class={horizontalItemClassName}><span>Products</span><ChevronRightIcon class="size-3.5 shrink-0 rotate-90" /></button>{/snippet}</MenuItem>{/snippet}</PopoverTrigger>
      <PopoverPortal><DropdownContent class={popupClassName}><MenuList orientation="vertical" parentValue="products" class={verticalListClassName}>
        <MenuItem value="analytics" class={verticalItemClassName}>Analytics</MenuItem>
        <Popover trigger={['hover', 'click']} side="right" align="start">
          <PopoverTrigger>{#snippet children(platformPopover)}<MenuItem value="platform" submenu>{#snippet trigger(item)}<button {...item.props} {...platformPopover.props} use:platformPopover.action aria-haspopup="menu" class={verticalItemClassName}><span class="flex-1 text-left">Platform</span><ChevronRightIcon class="size-4" /></button>{/snippet}</MenuItem>{/snippet}</PopoverTrigger>
          <PopoverPortal><DropdownContent class={popupClassName}><MenuList orientation="vertical" parentValue="platform" class={verticalListClassName}><MenuItem value="api" class={verticalItemClassName}>API</MenuItem><MenuItem value="automation" class={verticalItemClassName}>Automation</MenuItem><MenuItem value="integrations" class={verticalItemClassName}>Integrations</MenuItem></MenuList></DropdownContent></PopoverPortal>
        </Popover>
        <MenuItem value="security" class={verticalItemClassName}>Security</MenuItem>
      </MenuList></DropdownContent></PopoverPortal>
    </Popover>
    <MenuItem value="pricing" class={horizontalItemClassName}>Pricing</MenuItem>
  </MenuList>
</MenuRoot>
