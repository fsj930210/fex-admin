<script lang="ts">
  import SelectRoot from '@fex-design/svelte/primitive/select'
  import SelectContent from '@fex-design/svelte/primitive/select-content'
  import SelectTrigger from '@fex-design/svelte/primitive/select-trigger'
  import Tag from '@fex-design/svelte/primitive/tag'
  import { frameworkOptions } from './data'
  import Demo from './demo-section.svelte'
  const colors: Record<string,string> = { react:'#0284c7', vue:'#059669', angular:'#dc2626' }
</script>
<Demo title="Custom selected tags" description="The tag snippet controls each selected value."><SelectRoot multiple options={frameworkOptions} defaultValue={['react','vue','angular']}><SelectTrigger placeholder="请选择">{#snippet tag(item,remove)}<Tag size="sm" closable color={colors[String(item.value)]??'neutral'} onpointerdown={event=>event.preventDefault()} onClose={event=>{event.stopPropagation();remove()}}>{item.label}</Tag>{/snippet}</SelectTrigger><SelectContent/></SelectRoot></Demo>
