<script>
  import { stepInputNumber } from '@fex-design/core/input-number/value'
  import MinusIcon from '@fex-design/svelte/icon/minus'
  import PlusIcon from '@fex-design/svelte/icon/plus'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  let value = $state(5)
</script>

<Card title="Custom primitive logic" description="Core rules drive custom DOM.">
  <Button
    aria-label="Decrease value"
    onclick={() => (value = stepInputNumber(value, 'decrement', { min: 0, max: 10 }))}
  >
    <MinusIcon />
  </Button>
  <output class="mx-space-md">{value}</output>
  <Button
    aria-label="Increase value"
    onclick={() => (value = stepInputNumber(value, 'increment', { min: 0, max: 10 }))}
  >
    <PlusIcon />
  </Button>
</Card>
