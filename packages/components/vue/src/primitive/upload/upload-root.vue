<script setup lang="ts" generic="TResponse">
import type { UploadController, UploadOptions } from '@fex/components-core/upload/types'
import { uploadRootClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { computed, provide, ref, useAttrs, useId } from 'vue'
import { uploadContextKey } from './context'
import { useUploadController } from './use-upload'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    controller?: UploadController<TResponse>
    options?: UploadOptions<TResponse>
    invalid?: boolean
    name?: string
    required?: boolean
  }>(),
  { invalid: false, required: false },
)
const attrs = useAttrs()
const upload = useUploadController(() => props.options, props.controller)
const input = ref<HTMLInputElement | null>(null)
const inputId = useId()
const listId = useId()
const invalid = computed(() => props.invalid)
provide(uploadContextKey, { upload, input, inputId, listId, invalid })
const currentOptions = computed(() => {
  void props.options
  return upload.getOptions()
})
const directory = computed(() => upload.hasFeature('directory'))

function selectFiles(event: Event) {
  const element = event.currentTarget as HTMLInputElement
  const files = [...(element.files ?? [])]
  element.value = ''
  void upload.addFiles(files)
}
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    :class="cn(uploadRootClassName(), attrs.class as string | undefined)"
    :data-disabled="currentOptions.disabled || undefined"
    :data-invalid="invalid || undefined"
  >
    <slot :upload="upload" />
    <input
      ref="input"
      :id="inputId"
      class="sr-only"
      type="file"
      :name="name"
      :required="required"
      :disabled="currentOptions.disabled"
      :accept="currentOptions.accept"
      :multiple="directory || currentOptions.multiple"
      v-bind="directory ? { webkitdirectory: '', directory: '' } : {}"
      @change="selectFiles"
    />
  </div>
</template>
