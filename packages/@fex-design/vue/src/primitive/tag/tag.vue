<script setup lang="ts">
import { isTagPresetColor, tagClassName, tagCloseClassName, type TagColor, type TagStyleProps } from '@fex-design/styles/tag'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { CloseIcon } from '../../icon/close'

defineOptions({ name: 'Tag', inheritAttrs: false })
const props = withDefaults(defineProps<{ color?: TagColor; variant?: TagStyleProps['variant']; size?: TagStyleProps['size']; closable?: boolean; closeLabel?: string; disabled?: boolean }>(), { color: 'neutral', variant: 'subtle', size: 'md', closable: false, closeLabel: 'Close', disabled: false })
const emit = defineEmits<{ close: [event: MouseEvent] }>()
const attrs = useAttrs()
const preset = computed(() => isTagPresetColor(props.color))
const rootStyle = computed(() => [preset.value ? undefined : { '--tag-color': props.color }, attrs.style])
</script>

<template>
  <span v-bind="attrs" data-slot="tag" :data-color="preset ? color : 'custom'" :data-variant="variant" :data-size="size" :data-disabled="disabled ? 'true' : undefined" :class="cn(tagClassName({ variant, size }), attrs.class as string | undefined)" :style="rootStyle">
    <slot />
    <button v-if="closable" type="button" data-slot="tag-close" :aria-label="closeLabel" :disabled="disabled" :class="tagCloseClassName" @click="emit('close', $event)"><slot name="closeIcon"><CloseIcon aria-hidden="true" /></slot></button>
  </span>
</template>
