<script lang="ts">
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import Card from '@fex-design/svelte/ui/card'

  const maxLength = 120
  let value = $state('Textarea count is implemented by the demo, not by the primitive.')
</script>

<Card title="Count" description="Character count is derived by the caller and rendered wherever needed.">
  <div class="max-w-xl space-y-space-sm">
    <TextareaRoot value={value} onChange={(next) => (value = next)} autoSize={{ minRows: 3, maxRows: 6 }}>
      <TextareaInput aria-label="Textarea with count" maxLength={maxLength} />
    </TextareaRoot>
    <p class="text-right text-sm text-muted-foreground">{value.length} / {maxLength}</p>
  </div>
</Card>
