<script lang="ts">
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import Card from '@fex-design/svelte/ui/card'

  const defaultValue =
    'Line one starts at the minimum height.\nLine two expands the textarea.\nLine three keeps growing.\nLine four reaches the configured maxRows.\nLine five now scrolls inside.'
</script>

<Card
  title="Autosize"
  description="autoSize={{ minRows: 1, maxRows: 4 }}: content grows the field up to 4 rows, then the textarea scrolls."
>
  <TextareaRoot class="max-w-xl" autoSize={{ minRows: 1, maxRows: 4 }} defaultValue={defaultValue}>
    <TextareaInput
      aria-label="Autosize textarea"
      placeholder="Type multiple lines to grow the input"
    />
  </TextareaRoot>
</Card>
