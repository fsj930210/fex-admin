<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import ControlledDemo from './controlled-demo.svelte'
  import ActionsDemo from './actions-demo.svelte'
  import GapDemo from './gap-demo.svelte'
  import IndicatorDemo from './indicator-demo.svelte'
  import MaskDemo from './mask-demo.svelte'
  import NonModalDemo from './non-modal-demo.svelte'
  import PlacementDemo from './placement-demo.svelte'
</script>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-sm"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a><div><h1 class="text-2xl font-semibold text-foreground">Tour 漫游引导</h1><p class="max-w-3xl text-sm leading-6 text-muted-foreground">通过组合式 primitive 实现可控、可扩展的页面引导。</p></div></header><div class="space-y-space-xl"><BasicDemo /><ControlledDemo /><ActionsDemo /><GapDemo /><IndicatorDemo /><MaskDemo /><NonModalDemo /><PlacementDemo /></div></div></main>
