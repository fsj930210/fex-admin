<script lang="ts">
  import '@fex/styles'
  import { I18nProvider } from '@fex-design/svelte/i18n'
  import { i18n, i18nReady } from '../lib/i18n'
  let { children } = $props()
</script>

{#await i18nReady then}
  <I18nProvider controller={i18n}>{@render children()}</I18nProvider>
{/await}
