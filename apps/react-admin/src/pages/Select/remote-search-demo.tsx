import type { SelectOption } from '@fex/components-core/select/types'
import useUnmount from '@fex/components-react/hooks/use-unmount'
import {
  SelectContent,
  SelectEmpty,
  SelectList,
  SelectLoading,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { useRef, useState } from 'react'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function RemoteSearchDemo() {
  const [options, setOptions] = useState<readonly SelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const requestIdRef = useRef(0)

  const handleSearch = (keyword: string) => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current)
    const requestId = ++requestIdRef.current
    const normalized = keyword.trim().toLocaleLowerCase()
    setOpen(true)
    if (!normalized) {
      setLoading(false)
      setOptions([])
      timerRef.current = undefined
      return
    }
    setLoading(true)
    setOptions([])
    timerRef.current = setTimeout(() => {
      if (requestId !== requestIdRef.current) return
      setOptions(
        normalized
          ? frameworkOptions.filter((option) =>
              [option.label, option.searchText, ...(option.keywords ?? [])].some((text) =>
                text?.toLocaleLowerCase().includes(normalized),
              ),
            )
          : frameworkOptions,
      )
      setLoading(false)
      setOpen(true)
      timerRef.current = undefined
    }, 2000)
  }

  useUnmount(() => {
    requestIdRef.current += 1
    if (timerRef.current !== undefined) clearTimeout(timerRef.current)
  })

  return (
    <SelectDemoSection
      title="Remote search"
      description="The mock request waits two seconds, cancels stale keywords and returns only matching remote results."
    >
      <SelectRoot
        showSearch
        loading={loading}
        open={open}
        options={options}
        onOpenChange={setOpen}
        onSearch={handleSearch}
      >
        <SelectTrigger placeholder="请输入关键词远程搜索" />
        <SelectContent>
          {loading ? (
            <SelectLoading>Searching remote options…</SelectLoading>
          ) : options.length ? (
            <SelectList />
          ) : (
            <SelectEmpty>No remote results</SelectEmpty>
          )}
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
