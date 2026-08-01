import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex/components-react/primitive/auto-complete'
import { Empty, EmptyDescription } from '@fex/components-react/primitive/empty'
import { Card } from '@fex/components-react/ui/card'
import { Spinner } from '@fex/components-react/ui/spinner'
import { useRef, useState } from 'react'
import useUnmount from '@fex/components-react/hooks/use-unmount'
import { fieldNames, userSuggestions, type UserSuggestion } from './data'

export function RemoteDemo() {
  const [items, setItems] = useState<UserSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const request = useRef(0)
  useUnmount(() => {
    request.current++
    if (timer.current) clearTimeout(timer.current)
  })
  function search(keyword: string) {
    if (timer.current) clearTimeout(timer.current)
    const current = ++request.current
    setLoading(true)
    timer.current = setTimeout(() => {
      if (current !== request.current) return
      const normalized = keyword.trim().toLocaleLowerCase()
      setItems(userSuggestions.filter((item) => item.name.toLocaleLowerCase().includes(normalized)))
      setLoading(false)
    }, 600)
  }
  return (
    <Card
      title="Remote search and replaceable states"
      description="The caller owns requests; Content replaces generic loading and empty presentations."
    >
      <AutoCompleteRoot
        items={items}
        fieldNames={fieldNames}
        loading={loading}
        filterOption={false}
        onSearch={search}
      >
        <AutoCompleteTrigger placeholder="Search remote users" clearable />
        <AutoCompleteContent
          loadingContent={
            <div className="flex justify-center p-6">
              <Spinner />
              <span className="ml-2">Querying directory</span>
            </div>
          }
          emptyContent={
            <Empty>
              <EmptyDescription>No remote matches</EmptyDescription>
            </Empty>
          }
        />
      </AutoCompleteRoot>
    </Card>
  )
}
