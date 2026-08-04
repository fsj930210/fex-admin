<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import LoadingIcon from '../../icon/loading.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputSuffix from '../input/input-suffix.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import { getAutoCompleteContext } from './context'
  interface Props extends Omit<HTMLInputAttributes, 'value' | 'class' | 'prefix'> {
    class?: string | undefined
    clearable?: boolean
    invalid?: boolean
    status?: 'error' | 'warning'
    prefix?: Snippet
    suffix?: Snippet
  }
  let { class: className, clearable = false, invalid = false, status, prefix, suffix, onblur, onfocus, onkeydown, ...rest }: Props = $props()
  const autoComplete = getAutoCompleteContext('AutoCompleteTrigger')
  const snapshot = autoComplete.snapshot
  function keydown(event: KeyboardEvent) {
    onkeydown?.(event as Parameters<NonNullable<typeof onkeydown>>[0])
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      autoComplete.controller.setOpen(true, 'keyboard')
      autoComplete.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Enter' && $snapshot.open) {
      if (autoComplete.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') autoComplete.controller.setOpen(false, 'escape')
  }
  function valueChange(value: string) {
    autoComplete.controller.setValue(value)
    autoComplete.controller.setOpen(true, 'input')
  }
</script>
<PopoverTrigger>
  {#snippet children(trigger)}
    <InputRoot action={trigger.action} class={className} value={$snapshot.value} disabled={autoComplete.disabled()} readOnly={autoComplete.readOnly()} {invalid} {status} onValueChange={valueChange} onClear={() => autoComplete.controller.clear()}>
      {@render prefix?.()}
      <InputControl {...rest} role="combobox" aria-expanded={$snapshot.open} aria-controls={autoComplete.listId} aria-activedescendant={$snapshot.activeKey === undefined ? undefined : `${autoComplete.listId}-${$snapshot.activeKey}`} onfocus={event => { onfocus?.(event); if (!event.defaultPrevented) autoComplete.controller.setOpen(true, 'focus') }} onblur={event => { onblur?.(event); if (!event.defaultPrevented) autoComplete.controller.setOpen(false, 'blur') }} onkeydown={keydown} />
      {#if clearable}<InputClear />{/if}
      {#if autoComplete.loading() || suffix}<InputSuffix>{#if autoComplete.loading()}<LoadingIcon class="animate-spin" />{:else}{@render suffix?.()}{/if}</InputSuffix>{/if}
    </InputRoot>
  {/snippet}
</PopoverTrigger>
