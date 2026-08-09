<script lang="ts">
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'

  let value = $state<number | undefined>()
</script>

<Card title="Basic" description="Controlled and uncontrolled numeric values use icon actions.">
  <div class="grid gap-space-lg md:grid-cols-2">
    <InputNumber defaultValue={3} />
    <div>
      <InputNumber {value} onChange={(_, next) => (value = next)} />
      <p class="text-sm text-muted-foreground">Value: {value ?? 'empty'}</p>
    </div>
  </div>
</Card>
