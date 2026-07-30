<script lang="ts">
  import Rate from '@fex/components-svelte/primitive/rate'
  import Card from '@fex/components-svelte/ui/card'
  let value = $state(4.3)
  let previewValue = $state<number | null>(null)
</script>
<Card title="Arbitrary fractions" description="step controls interaction precision, while read-only values preserve their exact fraction."><div class="grid gap-space-lg"><div class="grid gap-space-sm"><Rate {value} step={0.1} onValueChange={(next) => value = next} onValuePreviewChange={(next) => previewValue = next} getValueText={(next, count) => `${next} points out of ${count}`} aria-label="Decimal rating" /><p class="text-sm text-muted-foreground">Interactive value: {(previewValue ?? value).toFixed(1)}</p></div><div class="grid gap-space-sm"><Rate value={4.37} readOnly aria-label="Exact read-only rating" /><p class="text-sm text-muted-foreground">Read-only value: 4.37</p></div></div></Card>
