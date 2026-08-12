<script lang="ts">
  import Anchor from '@fex-design/svelte/primitive/anchor'
  import Card from '@fex-design/svelte/ui/card'
  let container: HTMLDivElement
  const items = [{ key: 'horizontal-one', title: 'Overview', target: '#horizontal-overview' }, { key: 'horizontal-two', title: 'API', target: '#horizontal-api' }, { key: 'horizontal-three', title: 'Examples', target: '#horizontal-examples' }]
</script>
<Card title="Horizontal" description="Horizontal anchors use the same tracking behavior."><Anchor {items} orientation="horizontal" activeOffset={80} container={() => container ?? window} /><div bind:this={container} class="mt-space-md h-40 overflow-y-auto rounded-md border border-border p-space-lg"><section id="horizontal-overview" class="min-h-32">Overview content</section><section id="horizontal-api" class="min-h-32">API content</section><section id="horizontal-examples" class="min-h-32">Examples content</section></div></Card>
