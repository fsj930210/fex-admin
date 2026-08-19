<script lang="ts">
  import type { I18nController } from '@fex-design/core/i18n/types'
  import { readableCoreStore } from '../stores/core-store'
  import { setI18nContext } from './context'

  interface Props {
    controller: I18nController
    children?: import('svelte').Snippet
  }

  let { controller, children }: Props = $props()
  setI18nContext({ controller, snapshot: readableCoreStore(controller) })
</script>

{@render children?.()}
