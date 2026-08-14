<script lang="ts">
  import { ColorPickerRoot,ColorPickerSwatch } from '@fex-design/svelte/primitive/color-picker'
  import PopoverRoot from '@fex-design/svelte/primitive/popover'
  import PopoverContent from '@fex-design/svelte/primitive/popover-content'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import ChevronDownIcon from '@fex-design/svelte/icon/chevron-down'
  import Card from '@fex-design/svelte/ui/card'
  import PickerPanel from './picker-panel.svelte'
  const groups=[['primary',['#E6F4FF','#91CAFF','#69B1FF','#4096FF','#1677FF','#0958D9','#003EB3','#002C8C','#001D66']],['red',['#FFF1F0','#FFCCC7','#FFA39E','#FF7875','#FF4D4F','#F5222D','#CF1322','#A8071A','#820014']],['green',['#F6FFED','#D9F7BE','#B7EB8F','#95DE64','#73D13D','#52C41A','#389E0D','#237804','#135200']],['cyan',['#E6FFFB','#B5F5EC','#87E8DE','#5CDBD3','#36CFC9','#13C2C2','#08979C','#006D75','#00474F']]]as const
  let value=$state('#1677FF')
</script>
<Card title="预设颜色" description="打开面板后，可从预设分组选择颜色，也可使用右侧完整选择器编辑。"><ColorPickerRoot {value} onChange={next=>value=next?.toString('oklch')??value}><PopoverRoot placement="bottomLeft"><PopoverTrigger>{#snippet children(slot)}<button {...slot.props} use:slot.action class="inline-flex h-9 w-fit max-w-full self-start items-center rounded-md border border-border bg-background px-2"><ColorPickerSwatch/></button>{/snippet}</PopoverTrigger><PopoverPortal><PopoverContent class="w-max max-w-[calc(100vw-24px)] overflow-visible [--popover-content-max-width:calc(100vw-24px)]"><div class="grid gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]"><div class="grid content-start gap-3 border-b border-border pb-3 sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0">{#each groups as group(group[0])}<section><button type="button" class="mb-2 flex h-5 cursor-pointer items-center gap-2 text-xs text-muted-foreground"><ChevronDownIcon class="size-3"/><span>{group[0]}</span></button><div class="grid w-max grid-cols-7 gap-2">{#each group[1] as color(color)}<button class="size-6 cursor-pointer rounded border border-border" style:background={color} aria-label={color} onclick={()=>value=color}></button>{/each}</div></section>{/each}</div><PickerPanel/></div></PopoverContent></PopoverPortal></PopoverRoot></ColorPickerRoot></Card>
