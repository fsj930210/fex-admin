<script lang="ts">
  import { createThemeController } from '@fex-design/core/theme/create-theme-controller'
  import { THEME_MEDIA } from '@fex-design/core/theme/constants'
  import { getSystemTheme } from '@fex-design/core/theme/system-theme'
  import type { ThemeControllerOptions, ThemeScope } from '@fex-design/core/theme/types'
  import { getContext, onMount, setContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { Readable } from 'svelte/store'
  import { readableCoreStore } from '../../stores/core-store'
  import { THEME_PROVIDER_CONTEXT, type ThemeProviderContext } from './context'

  interface ThemeProviderProps extends ThemeControllerOptions {
    scope?: ThemeScope
    class?: string
    as?: keyof HTMLElementTagNameMap
    children?: Snippet
  }

  let {
    scope = 'root',
    class: className,
    as = 'div',
    children,
    ...options
  }: ThemeProviderProps = $props()

  const ownController =
    scope === 'inherit'
      ? undefined
      : createThemeController({
          attribute: 'class',
          defaultTheme: 'light',
          enableColorScheme: false,
          enableSystem: false,
          themes: ['light', 'dark'],
          ...options,
        })
  let containerElement: HTMLElement | undefined

  const parentContext = getContext<ThemeProviderContext | undefined>(THEME_PROVIDER_CONTEXT)
  if (scope === 'root' && parentContext) {
    throw new Error("ThemeProvider scope='root' cannot be nested.")
  }
  if (scope === 'root' && !options.storageKey && !options.forcedTheme) {
    throw new Error("ThemeProvider scope='root' requires storageKey unless forcedTheme is provided.")
  }
  if (scope === 'inherit' && !parentContext) {
    throw new Error("ThemeProvider scope='inherit' requires a parent provider.")
  }
  if (scope === 'inherit' && options.forcedTheme) {
    throw new Error("ThemeProvider scope='inherit' cannot use forcedTheme.")
  }

  const controller = ownController ?? parentContext!.controller
  const snapshot: Readable<ReturnType<typeof controller.getSnapshot>> =
    ownController ? readableCoreStore(ownController) : parentContext!.snapshot
  const context = { controller, snapshot }
  setContext(THEME_PROVIDER_CONTEXT, scope === 'inherit' ? parentContext! : context)

  function syncTheme() {
    if (!ownController) return
    const element = scope === 'root' ? document.documentElement : containerElement
    if (element) ownController.applyTo(element)
  }

  $effect(() => {
    if (!ownController) return
    ownController.setOptions({
      attribute: options.attribute,
      colorSchemeMap: options.colorSchemeMap,
      defaultTheme: options.defaultTheme,
      enableColorScheme: options.enableColorScheme,
      enableSystem: options.enableSystem,
      forcedTheme: options.forcedTheme,
      storageKey: options.storageKey,
      themes: options.themes,
    })
  })

  onMount(() => {
    if (!ownController) return
    syncTheme()
    const unsubscribe = ownController.subscribe(syncTheme)
    const media = options.enableSystem ? window.matchMedia(THEME_MEDIA) : undefined
    const handleMedia = (event: MediaQueryListEvent | MediaQueryList) => {
      ownController.setSystemTheme(getSystemTheme(event))
    }
    media?.addEventListener('change', handleMedia)
    if (media) handleMedia(media)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === options.storageKey) ownController.syncStoredTheme(event.newValue)
    }
    if (options.storageKey && !options.forcedTheme) {
      window.addEventListener('storage', handleStorage)
    }
    return () => {
      unsubscribe()
      media?.removeEventListener('change', handleMedia)
      window.removeEventListener('storage', handleStorage)
    }
  })
</script>

{#if scope === 'local'}
  <svelte:element
    this={as}
    bind:this={containerElement}
    class={className}
    data-theme-scope={options.storageKey}
  >
    {@render children?.()}
  </svelte:element>
{:else}
  {@render children?.()}
{/if}
