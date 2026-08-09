<script>
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'

  let message = $state('Use ArrowUp, ArrowDown or buttons.')
</script>

<Card title="Keyboard and events" description="Native event stays first.">
  <InputNumber
    clearable
    defaultValue={5}
    onChange={(event, value) => (message = `${event.type}: ${value ?? 'empty'}`)}
  />
  <p class="text-sm text-muted-foreground">{message}</p>
</Card>
