<script setup lang="ts">
import {
  getAnchorScrollTop,
  getAnchorTargetTop,
  getAnchorViewportHeight,
  getAnchorIndicatorStyles,
  ensureAnchorLinkVisible,
  isAnchorScrolledToEnd,
  resolveAnchorTarget,
} from '@fex-design/core/anchor/dom'
import { createAnchorController } from '@fex-design/core/anchor/model'
import { flattenAnchorItems, getAnchorActiveKeys, getAnchorHighlightedKeys } from '@fex-design/core/anchor/model'
import type { AnchorActiveMode, AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
import { anchorIndicatorClassName, anchorRailClassName, anchorRootClassName } from '@fex-design/styles/anchor'
import { cn } from '@fex/utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import AnchorList from './anchor-list.vue'
import { useCoreStore } from '../../composables/use-core-store'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  items: readonly AnchorItem<string>[]
  activeKeys?: readonly string[]
  defaultActiveKeys?: readonly string[]
  activeMode?: AnchorActiveMode
  orientation?: AnchorOrientation
  container?: Window | HTMLElement | (() => Window | HTMLElement)
  offset?: number
  activeOffset?: number
  behavior?: ScrollBehavior
}>(), {
  defaultActiveKeys: () => [], activeMode: 'current', orientation: 'vertical', offset: 0, activeOffset: 0, behavior: 'smooth',
})
const emit = defineEmits<{ change: [keys: readonly string[], items: readonly AnchorItem<string>[]] }>()
const attrs = useAttrs()
const root = ref<HTMLElement>()
const inkStyles = ref<ReturnType<typeof getAnchorIndicatorStyles>>([])
const controller = createAnchorController<string>({ activeKeys: props.activeKeys, defaultActiveKeys: props.defaultActiveKeys, onChange: (keys, items) => emit('change', keys, items) })
const storeSnapshot = useCoreStore(controller)
const currentKeys = computed(() => {
  void storeSnapshot.value
  controller.updateOptions({ activeKeys: props.activeKeys, defaultActiveKeys: props.defaultActiveKeys, onChange: (keys, items) => emit('change', keys, items) })
  return controller.getSnapshot().activeKeys
})
const flatItems = computed(() => flattenAnchorItems(props.items))
const visibleItems = computed(() => props.orientation === 'horizontal' ? flatItems.value.filter((item) => item.level === 0) : flatItems.value)
const highlightedKeys = computed(() => getAnchorHighlightedKeys(currentKeys.value, flatItems.value))
const scrollContainer = () => typeof props.container === 'function' ? props.container() : (props.container ?? window)

function change(keys: readonly string[]) {
  const keySet = new Set(keys)
  controller.change(keys, flatItems.value.filter(({ item }) => keySet.has(item.key)).map(({ item }) => item))
}
function update() {
  const container = scrollContainer()
  const positions = visibleItems.value.flatMap(({ item }) => {
    const target = resolveAnchorTarget(item.target)
    return target ? [{ item, top: getAnchorTargetTop(target, container) }] : []
  })
  change(getAnchorActiveKeys({ positions, scrollTop: getAnchorScrollTop(container), viewportHeight: getAnchorViewportHeight(container), offset: props.offset, activeOffset: props.activeOffset, mode: props.activeMode, scrolledToEnd: isAnchorScrolledToEnd(container) }))
  if (root.value) { ensureAnchorLinkVisible(root.value, currentKeys.value, props.orientation); inkStyles.value = getAnchorIndicatorStyles(root.value, currentKeys.value, props.orientation) }
}
function activate(item: AnchorItem<string>) {
  const target = resolveAnchorTarget(item.target)
  if (!target) return
  const container = scrollContainer()
  const index = visibleItems.value.findIndex(({ item: entry }) => entry.key === item.key)
  change(props.activeMode === 'progress' ? visibleItems.value.slice(0, index + 1).map(({ item: entry }) => entry.key) : [item.key])
  container.scrollTo({ top: Math.max(getAnchorTargetTop(target, container) - props.offset, 0), behavior: props.behavior })
}
let frame = 0
const scheduleUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
onMounted(() => { const container = scrollContainer(); scheduleUpdate(); container.addEventListener('scroll', scheduleUpdate, { passive: true }); window.addEventListener('resize', scheduleUpdate) })
onBeforeUnmount(() => { const container = scrollContainer(); cancelAnimationFrame(frame); container.removeEventListener('scroll', scheduleUpdate); window.removeEventListener('resize', scheduleUpdate) })
watch(currentKeys, async () => { await nextTick(); if (root.value) { ensureAnchorLinkVisible(root.value, currentKeys.value, props.orientation); inkStyles.value = getAnchorIndicatorStyles(root.value, currentKeys.value, props.orientation) } })
</script>

<template>
  <nav
    v-bind="attrs"
    ref="root"
    data-slot="anchor"
    :data-orientation="orientation"
    :class="cn(anchorRootClassName({ orientation }), attrs.class as string | undefined)"
  >
    <div aria-hidden="true" data-slot="anchor-rail" :class="anchorRailClassName({ orientation })">
      <span
        v-for="(inkStyle, index) in inkStyles"
        :key="index"
        data-slot="anchor-indicator"
        :class="anchorIndicatorClassName({ orientation })"
        :style="{ top: inkStyle.top === undefined ? undefined : `${inkStyle.top}px`, left: inkStyle.left === undefined ? undefined : `${inkStyle.left}px`, width: inkStyle.width === undefined ? undefined : `${inkStyle.width}px`, height: inkStyle.height === undefined ? undefined : `${inkStyle.height}px` }"
      />
    </div>
    <AnchorList :items="items" :active-keys="currentKeys" :highlighted-keys="highlightedKeys" :orientation="orientation" @activate="activate">
      <template #item="slotProps"><slot name="item" v-bind="slotProps">{{ slotProps.item.title }}</slot></template>
    </AnchorList>
  </nav>
</template>
