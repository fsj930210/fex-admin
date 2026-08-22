import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/solid/primitive/auto-complete'
import Card from '@fex-design/solid/ui/card'
import { createSignal, onCleanup, Show } from 'solid-js'
import { fieldNames, users, type UserSuggestion } from './data'

export function RemoteDemo() {
  const [items, setItems] = createSignal<UserSuggestion[]>([])
  const [loading, setLoading] = createSignal(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let request = 0
  function search(keyword: string) {
    if (timer) clearTimeout(timer)
    const current = ++request
    setLoading(true)
    timer = setTimeout(() => {
      if (current !== request) return
      const normalized = keyword.trim().toLocaleLowerCase()
      setItems(users.filter((item) => item.name.toLocaleLowerCase().includes(normalized)))
      setLoading(false)
    }, 600)
  }
  onCleanup(() => {
    request++
    if (timer) clearTimeout(timer)
  })
  return (
    <Card
      title="Remote search and replaceable states"
      description="The caller owns requests; Content replaces generic loading and empty presentations."
    >
      <AutoCompleteRoot
        items={items()}
        fieldNames={fieldNames}
        loading={loading()}
        filterOption={false}
        onSearch={search}
      >
        <AutoCompleteTrigger placeholder="Search remote users" clearable />
        <AutoCompleteContent>
          <Show
            when={!loading()}
            fallback={
              <div class="p-6 text-center text-sm text-muted-foreground">Querying directory…</div>
            }
          >
            <Show
              when={items().length > 0}
              fallback={
                <div class="p-6 text-center text-sm text-muted-foreground">No remote matches</div>
              }
            >
              <AutoCompleteList />
            </Show>
          </Show>
        </AutoCompleteContent>
      </AutoCompleteRoot>
    </Card>
  )
}
