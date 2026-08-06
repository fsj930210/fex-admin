<script lang="ts">
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import TextareaClear from '@fex-design/svelte/primitive/textarea-clear'
  import Card from '@fex-design/svelte/ui/card'

  let value = $state('Controlled textarea value')
</script>

<Card
  title="Controlled and uncontrolled"
  description="Root owns the value protocol; callers can provide value or only defaultValue."
>
  <div class="grid gap-space-lg md:grid-cols-2">
    <div class="space-y-space-sm">
      <TextareaRoot value={value} onChange={(next) => (value = next)} autoSize={{ minRows: 2, maxRows: 5 }}>
        <TextareaInput aria-label="Controlled textarea" placeholder="Controlled" />
        <TextareaClear aria-label="Clear controlled textarea" />
      </TextareaRoot>
      <p class="text-sm text-muted-foreground">Value: {value || '(empty)'}</p>
    </div>

    <TextareaRoot defaultValue="Uncontrolled textarea value" autoSize={{ minRows: 2, maxRows: 5 }}>
      <TextareaInput aria-label="Uncontrolled textarea" placeholder="Uncontrolled" />
      <TextareaClear aria-label="Clear uncontrolled textarea" />
    </TextareaRoot>
  </div>
</Card>
