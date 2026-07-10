<script setup lang="ts">
import {
  toastStackContainerClassName,
  toastStackItemsClassName,
  toastStackLayerClassName,
  toastViewportClassName,
  type ToastPlacement,
} from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { useToasts } from '../../composables/use-toasts'
import { toast, type VueToastManager } from './toast-manager'

const props = withDefaults(defineProps<{
  class?: string
  manager?: VueToastManager
  offset?: number | string
  placement?: ToastPlacement
  stack?: boolean
  stackThreshold?: number
  teleport?: boolean
  to?: string | HTMLElement
}>(), {
  offset: 24,
  stack: false,
  stackThreshold: 3,
  teleport: true,
  to: 'body',
})

const manager = props.manager ?? toast
const { items } = useToasts(manager)
const placements = computed<ToastPlacement[]>(() => props.placement ? [props.placement] : ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'])
const offsetStyle = computed(() => ({ '--toast-offset': typeof props.offset === 'number' ? `${props.offset}px` : props.offset }))
</script>

<template>
  <Teleport :disabled="!props.teleport" :to="props.to">
    <template v-for="currentPlacement in placements" :key="currentPlacement">
      <template v-if="items.some((item) => item.placement === currentPlacement)">
        <div
          v-bind="$attrs"
          data-slot="toast-viewport"
          :class="cn(toastViewportClassName({ placement: currentPlacement }), props.class)"
          :style="offsetStyle"
        >
          <div :class="toastStackContainerClassName({ placement: currentPlacement })">
            <template v-if="props.stack && items.filter((item) => item.placement === currentPlacement).length > props.stackThreshold">
              <div aria-hidden="true" :class="cn(toastStackLayerClassName, 'top-2 opacity-70')" />
              <div aria-hidden="true" :class="cn(toastStackLayerClassName, 'top-4 w-[calc(100%-32px)] opacity-40')" />
            </template>
            <div :class="toastStackItemsClassName({ placement: currentPlacement })">
              <slot
                :items="props.stack && items.filter((item) => item.placement === currentPlacement).length > props.stackThreshold
                  ? items.filter((item) => item.placement === currentPlacement).slice(-1)
                  : items.filter((item) => item.placement === currentPlacement)"
                :manager="manager"
              />
            </div>
          </div>
        </div>
      </template>
    </template>
  </Teleport>
</template>
