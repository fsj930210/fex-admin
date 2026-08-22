import { useState } from 'react'
import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DefaultTourActions, DemoTarget, TourPanel } from './shared'

export function ControlledTourDemo() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  return (
    <Card title="受控" description="open 和 current 可以完全交给业务状态管理。">
      <Tour.Root
        open={open}
        current={current}
        onOpenChange={setOpen}
        onChange={setCurrent}
      >
        <div className="flex flex-wrap items-center gap-2">
          <DemoTarget name="controlled-first">受控目标一</DemoTarget>
          <DemoTarget name="controlled-second">受控目标二</DemoTarget>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm"
            onClick={() => {
              setCurrent(0)
              setOpen(true)
            }}
          >
            受控打开
          </button>
          <span className="text-sm text-muted-foreground">current: {current}</span>
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          <Tour.Step name="controlled-first" target="controlled-first">
          <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="受控第一步" description="current 和 open 都由外部 state 管理。">
                <DefaultTourActions />
              </TourPanel>
            </Tour.Content>
          </Tour.Step>
          <Tour.Step name="controlled-second" target="controlled-second">
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="受控第二步" description="onChange 会把导航请求交给父组件。">
                <DefaultTourActions />
              </TourPanel>
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
