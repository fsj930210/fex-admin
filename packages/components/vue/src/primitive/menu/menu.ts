import { defineComponent, h } from 'vue'
import { useMenu } from './use-menu'

export const MenuRoot = defineComponent({
  name: 'MenuRoot',
  setup(_, context) {
    return () => h('div', { ...context.attrs, role: 'menu', 'data-slot': 'menu' }, context.slots)
  },
})

export { useMenu }
export type {
  MenuDividerItem,
  MenuGroupItem,
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuNodeItem,
  MenuRenderItemInfo,
} from './menu-types'
