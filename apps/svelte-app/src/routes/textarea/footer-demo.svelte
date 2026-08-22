<script lang="ts">
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import TextareaClear from '@fex-design/svelte/primitive/textarea-clear'
  import TextareaFooter from '@fex-design/svelte/primitive/textarea-footer'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  import CheckIcon from '@fex-design/svelte/icon/check'
  import InfoIcon from '@fex-design/svelte/icon/info'
  import PlusIcon from '@fex-design/svelte/icon/plus'

  let value = $state('')
</script>

<Card title="Footer" description="Footer is only a layout slot; actions are fully owned by the caller.">
  <TextareaRoot
    class="max-w-2xl"
    value={value}
    onChange={(next) => (value = next)}
    autoSize={{ minRows: 1, maxRows: 8 }}
  >
    <TextareaInput aria-label="AI message" placeholder="Ask anything" />
    <TextareaClear aria-label="Clear message" />
    <TextareaFooter>
      <div class="flex min-w-0 flex-wrap items-center gap-1">
        <Button aria-label="Attach" size="icon-sm" variant="ghost">
          {#snippet icon()}<PlusIcon />{/snippet}
        </Button>
        <Button size="sm" variant="ghost">
          {#snippet icon()}<InfoIcon />{/snippet}
          Context
        </Button>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span>{value.length} / 2000</span>
        <Button aria-label="Send" disabled={!value.trim()} size="icon-sm">
          {#snippet icon()}<CheckIcon />{/snippet}
        </Button>
      </div>
    </TextareaFooter>
  </TextareaRoot>
</Card>
