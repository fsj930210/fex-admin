<script setup lang="ts">
import { avatarClassName, type AvatarStyleProps } from '@fex-design/styles/avatar'
import { cn } from '@fex/utils'
import { provide, ref, useAttrs } from 'vue'
import { avatarContext } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{ size?: AvatarStyleProps['size']; shape?: AvatarStyleProps['shape'] }>(),
  { size: 'md', shape: 'circle' },
)
const attrs = useAttrs()
const loaded = ref(false)
provide(avatarContext, { loaded })
</script>
<template>
  <span
    v-bind="attrs"
    data-slot="avatar"
    :data-size="props.size"
    :data-shape="props.shape"
    :class="
      cn(
        avatarClassName({ size: props.size, shape: props.shape }),
        attrs.class as string | undefined,
      )
    "
    ><slot
  /></span>
</template>
