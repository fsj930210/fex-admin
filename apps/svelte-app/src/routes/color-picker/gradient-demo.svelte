<script lang="ts">
  import type { LinearGradientInput } from '@fex-design/core/gradient/types'
  import { GradientPickerRoot } from '@fex-design/svelte/primitive/color-picker'
  import Card from '@fex-design/svelte/ui/card'
  import GradientPopup from './gradient-popup.svelte'

  const initial: LinearGradientInput = {
    type: 'linear-gradient',
    angle: 90,
    interpolation: 'oklch',
    stops: [
      { id: 'start', color: 'rgb(16 142 233)', position: 0 },
      { id: 'end', color: 'rgb(135 208 104)', position: 1 },
    ],
  }
</script>

<Card title="渐变色" description="选择色标后编辑当前颜色；点击轨道新增色标，拖动色标调整位置，使用 OKLCH 插值。">
  <GradientPickerRoot defaultValue={initial}>
    <GradientPopup />
  </GradientPickerRoot>
</Card>
