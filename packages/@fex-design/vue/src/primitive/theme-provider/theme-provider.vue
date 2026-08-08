<script setup lang="ts">
import { createThemeController } from '@fex-design/core/theme/create-theme-controller'
import { THEME_MEDIA } from '@fex-design/core/theme/constants'
import { getSystemTheme } from '@fex-design/core/theme/system-theme'
import type { ColorScheme, ThemeAttribute, ThemeScope } from '@fex-design/core/theme/types'
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, useAttrs, watch } from 'vue'
import { themeProviderContextKey } from './context'

interface ThemeProviderProps {
  themes?: string[]
  defaultTheme?: string
  forcedTheme?: string
  enableSystem?: boolean
  enableColorScheme?: boolean
  attribute?: ThemeAttribute
  storageKey?: string
  colorSchemeMap?: Record<string, ColorScheme>
  systemTheme?: ColorScheme
  scope?: ThemeScope
  className?: string
  as?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<ThemeProviderProps>(), {
  as: 'div',
  attribute: 'class',
  defaultTheme: 'light',
  enableColorScheme: false,
  enableSystem: false,
  scope: 'root',
  themes: () => ['light', 'dark'],
})

const attrs = useAttrs()
const parentContext = inject(themeProviderContextKey, null)
if (props.scope === 'root' && parentContext) {
  throw new Error("ThemeProvider scope='root' cannot be nested.")
}
if (props.scope === 'root' && !props.storageKey && !props.forcedTheme) {
  throw new Error("ThemeProvider scope='root' requires storageKey unless forcedTheme is provided.")
}
if (props.scope === 'inherit' && !parentContext) {
  throw new Error("ThemeProvider scope='inherit' requires a parent provider.")
}
if (props.scope === 'inherit' && props.forcedTheme) {
  throw new Error("ThemeProvider scope='inherit' cannot use forcedTheme.")
}

const isInheritScope = props.scope === 'inherit'
const controller = isInheritScope ? parentContext!.controller : createThemeController(props)
const snapshot = isInheritScope ? parentContext!.snapshot : shallowRef(controller.getSnapshot())
const containerRef = ref<HTMLElement | null>(null)

function getElement() {
  return props.scope === 'root' ? document.documentElement : containerRef.value
}

function syncTheme() {
  snapshot.value = controller.getSnapshot()
  const element = getElement()
  if (element) controller.applyTo(element)
}

provide(themeProviderContextKey, isInheritScope ? parentContext! : { controller, snapshot })

const unsubscribe = isInheritScope ? undefined : controller.subscribe(syncTheme)

// Prop changes update the external core controller; DOM synchronization stays in the controller subscription.
watch(
  () => ({
    attribute: props.attribute,
    colorSchemeMap: props.colorSchemeMap,
    defaultTheme: props.defaultTheme,
    enableColorScheme: props.enableColorScheme,
    enableSystem: props.enableSystem,
    forcedTheme: props.forcedTheme,
    storageKey: props.storageKey,
    themes: props.themes,
  }),
  (options) => {
    if (!isInheritScope) controller.setOptions(options)
  },
  { deep: true },
)

let removeMediaListener: (() => void) | undefined
let removeStorageListener: (() => void) | undefined

onMounted(() => {
  if (isInheritScope) return
  syncTheme()

  if (props.enableSystem) {
    const media = window.matchMedia(THEME_MEDIA)
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      controller.setSystemTheme(getSystemTheme(event))
    }
    handleChange(media)
    media.addEventListener('change', handleChange)
    removeMediaListener = () => media.removeEventListener('change', handleChange)
  }

  if (props.storageKey && !props.forcedTheme) {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === props.storageKey) controller.syncStoredTheme(event.newValue)
    }
    window.addEventListener('storage', handleStorageChange)
    removeStorageListener = () => window.removeEventListener('storage', handleStorageChange)
  }
})

onBeforeUnmount(() => {
  unsubscribe?.()
  removeMediaListener?.()
  removeStorageListener?.()
})
</script>

<template>
  <component
    v-if="props.scope === 'local'"
    :is="props.as"
    ref="containerRef"
    :class="props.className ?? attrs.class"
    :data-theme-scope="props.storageKey"
  >
    <slot />
  </component>
  <slot v-else />
</template>
