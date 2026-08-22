<script lang="ts">
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Basic" description="TextareaInput keeps native textarea semantics inside TextareaRoot.">
  <TextareaRoot class="max-w-xl" defaultValue="Review the latest support request.">
    <TextareaInput aria-label="Basic textarea" placeholder="Write a note" />
  </TextareaRoot>
</Card>
