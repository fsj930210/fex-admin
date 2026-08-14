<script setup lang="ts">
import { createColorPickerController } from '@fex-design/core/color-picker/create-color-picker-controller'
import type { ColorChangeDetail } from '@fex-design/core/color-picker/types'
import type { ColorFormat,ColorInput,ColorValue } from '@fex-design/core/color/types'
import { computed,provide } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { colorPickerKey } from './context'
const props=defineProps<{value?:ColorInput|null;defaultValue?:ColorInput|null;format?:ColorFormat;defaultFormat?:ColorFormat;disabled?:boolean}>()
const emit=defineEmits<{change:[value:ColorValue|null,detail:ColorChangeDetail];changeComplete:[value:ColorValue|null,detail:ColorChangeDetail];formatChange:[format:ColorFormat]}>()
const options={get value(){return props.value},get defaultValue(){return props.defaultValue},get format(){return props.format},get defaultFormat(){return props.defaultFormat},get disabled(){return props.disabled},onChange:(v:ColorValue|null,d:ColorChangeDetail)=>emit('change',v,d),onChangeComplete:(v:ColorValue|null,d:ColorChangeDetail)=>emit('changeComplete',v,d),onFormatChange:(v:ColorFormat)=>emit('formatChange',v)}
const controller=createColorPickerController(options);const storeSnapshot=useCoreStore(controller);const snapshot=computed(()=>{void storeSnapshot.value;return controller.getSnapshot()});provide(colorPickerKey,{controller,snapshot})
</script><template><slot :controller="controller" :snapshot="snapshot" /></template>
