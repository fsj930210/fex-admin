<script setup lang="ts">
import type { DropFeatureApi } from '@fex/components-core/upload/features/drop'
import type { PasteFeatureApi } from '@fex/components-core/upload/features/paste'
import { getDroppedFiles } from '@fex/components-core/upload/get-dropped-files'
import { uploadDropzoneClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { onScopeDispose, ref, useAttrs } from 'vue'
import { useUploadContext } from './context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { upload, invalid } = useUploadContext()
const drop = upload.getFeature<DropFeatureApi>('drop')
const paste = upload.getFeature<PasteFeatureApi>('paste')
const dragging = ref(drop?.getDragging() ?? false)
const unsubscribe = drop?.subscribe(() => {
  dragging.value = drop.getDragging()
})
onScopeDispose(() => unsubscribe?.())
const disabled = () => upload.getOptions().disabled
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    role="button"
    :tabindex="disabled() ? undefined : 0"
    :aria-disabled="disabled()"
    :aria-invalid="invalid"
    :data-dragging="dragging || undefined"
    :data-disabled="disabled() || undefined"
    :data-invalid="invalid || undefined"
    :class="cn(uploadDropzoneClassName(), attrs.class as string | undefined)"
    @dragenter.prevent="drop?.dragEnter()"
    @dragover.prevent
    @dragleave="drop?.dragLeave()"
    @drop.prevent="getDroppedFiles($event.dataTransfer!).then((files) => drop?.drop(files))"
    @paste="
      paste && $event.clipboardData?.files.length
        ? (paste.paste([...$event.clipboardData.files]), $event.preventDefault())
        : undefined
    "
  >
    <slot />
  </div>
</template>
