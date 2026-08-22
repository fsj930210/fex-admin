<script>
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Step and precision" description="Decimal stepping is rounded to the configured precision.">
  <InputNumber class="max-w-sm" defaultValue={1.5} step={0.25} precision={2} aria-label="Decimal step" />
</Card>
