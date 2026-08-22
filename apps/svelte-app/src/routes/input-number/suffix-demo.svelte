<script>
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Suffix and clear" description="Suffix replaces actions while clear remains independent.">
  <div class="grid gap-space-md md:grid-cols-3">
    <InputNumber clearable defaultValue={20} />
    <InputNumber defaultValue={20}>{#snippet suffix()}kg{/snippet}</InputNumber>
    <InputNumber clearable defaultValue={20}>{#snippet suffix()}%{/snippet}</InputNumber>
  </div>
</Card>
