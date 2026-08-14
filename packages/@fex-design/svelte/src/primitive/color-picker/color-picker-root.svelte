<script lang="ts">
  import { createColorPickerController } from '@fex-design/core/color-picker/create-color-picker-controller'
  import type { ColorPickerOptions } from '@fex-design/core/color-picker/types'
  import { setContext, type Snippet } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { colorPickerKey, type ColorPickerContext } from './context'
  interface Props extends ColorPickerOptions { children?: Snippet }
  let { value, defaultValue, format, defaultFormat, disabled, onChange, onChangeComplete, onFormatChange, children }: Props = $props()
  const options = { get value(){return value}, get defaultValue(){return defaultValue}, get format(){return format}, get defaultFormat(){return defaultFormat}, get disabled(){return disabled}, onChange:(next:any,detail:any)=>onChange?.(next,detail), onChangeComplete:(next:any,detail:any)=>onChangeComplete?.(next,detail), onFormatChange:(next:any)=>onFormatChange?.(next) }
  const controller=createColorPickerController(options)
  const storeSnapshot=readableCoreStore(controller)
  const snapshot=()=>{void $storeSnapshot;return controller.getSnapshot()}
  setContext(colorPickerKey,{controller,snapshot} satisfies ColorPickerContext)
</script>
{@render children?.()}
