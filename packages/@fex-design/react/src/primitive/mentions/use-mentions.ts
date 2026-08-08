import type { MentionsKey } from '@fex-design/core/mentions/types'
import { useMentionsContext } from './mentions-context'

export function useMentions() {
  const context = useMentionsContext('useMentions')
  const { snapshot } = context
  return {
    value: snapshot.value,
    open: snapshot.open,
    query: snapshot.query,
    prefix: snapshot.query?.prefix ?? null,
    text: snapshot.query?.text ?? '',
    activeKey: snapshot.activeKey,
    activeId:
      snapshot.activeKey === undefined ? undefined : context.listId + '-' + snapshot.activeKey,
    disabled: context.disabled,
    readOnly: context.readOnly,
    invalid: context.invalid,
    required: context.required,
    close: () => context.controller.setOpen(false, 'programmatic'),
    selectItem: (key: MentionsKey) => context.controller.selectItem(key),
  }
}

export function useMentionsItem(key: MentionsKey, disabled?: boolean | undefined) {
  const context = useMentionsContext('useMentionsItem')
  return {
    active: context.snapshot.activeKey === key,
    disabled: disabled === true,
    activate: () => context.controller.setActiveKey(key, 'pointer'),
    select: () => context.controller.selectItem(key),
  }
}
