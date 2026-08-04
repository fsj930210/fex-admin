<script lang="ts">
  import Rate from '@fex-design/svelte/primitive/rate'
  import Card from '@fex-design/svelte/ui/card'
  let value = $state(3)
</script>
<Card title="Default integer" description="The default step is 1, so pointer and keyboard input select whole values."><div class="grid gap-space-sm"><Rate {value} onValueChange={(next) => value = next} aria-label="Integer rating" /><p class="text-sm text-muted-foreground">Current value: {value}</p></div></Card>
