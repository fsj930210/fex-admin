import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableClassName, tableContainerClassName, tableFooterClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'

export const Table = defineComponent({
  name: 'Table',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('div', { 'data-slot': 'table-container', class: tableContainerClassName }, [
      h('table', { ...attrs, 'data-slot': 'table', class: cn(tableClassName, attrs.class as string | undefined) }, slots.default?.()),
    ])
  },
})

function createPart(name: string, tag: string, slot: string, className: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs, 'data-slot': slot, class: cn(className, attrs.class as string | undefined) }, slots.default?.())
    },
  })
}

export const TableHeader = createPart('TableHeader', 'thead', 'table-header', tableHeaderClassName)
export const TableBody = createPart('TableBody', 'tbody', 'table-body', tableBodyClassName)
export const TableFooter = createPart('TableFooter', 'tfoot', 'table-footer', tableFooterClassName)
export const TableRow = createPart('TableRow', 'tr', 'table-row', tableRowClassName)
export const TableHead = createPart('TableHead', 'th', 'table-head', tableHeadClassName)
export const TableCell = createPart('TableCell', 'td', 'table-cell', tableCellClassName)
export const TableCaption = createPart('TableCaption', 'caption', 'table-caption', tableCaptionClassName)
