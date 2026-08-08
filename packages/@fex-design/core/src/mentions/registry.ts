import type { MentionsKey, MentionsRegisteredItem } from './types'

export function createMentionsRegistry<TData = unknown>() {
  const items = new Map<MentionsKey, MentionsRegisteredItem<TData>>()

  return {
    register(item: MentionsRegisteredItem<TData>) {
      items.set(item.key, item)
      return () => {
        if (items.get(item.key) === item) items.delete(item.key)
      }
    },
    getItem(key: MentionsKey) {
      return items.get(key)
    },
    getItems() {
      return Array.from(items.values())
    },
    getEnabledItems() {
      return Array.from(items.values()).filter((item) => !item.disabled)
    },
  }
}
