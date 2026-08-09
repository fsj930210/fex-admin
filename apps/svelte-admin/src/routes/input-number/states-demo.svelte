<script>
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="States" description="Input state styling is reused.">
  <div class="grid gap-space-md md:grid-cols-2">
    <InputNumber disabled defaultValue={10} />
    <InputNumber readonly defaultValue={10} />
    <InputNumber invalid defaultValue={10} />
    <InputNumber status="warning" defaultValue={10} />
  </div>
</Card>
