import { Card } from '@fex-design/react/ui/card'
import { Tour, useTour } from '@fex-design/react/primitive/tour'
import { StartTourButton, TourPanel } from './shared'

const placements = [
  'top',
  'topLeft',
  'topRight',
  'right',
  'rightTop',
  'rightBottom',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'left',
  'leftTop',
  'leftBottom',
] as const

function PlacementActions() {
  const { snapshot } = useTour()
  return (
    <div className="flex justify-end gap-2">
      <Tour.Control action="previous">上一步</Tour.Control>
      <Tour.Control action={snapshot.isLast ? 'complete' : 'next'}>
        {snapshot.isLast ? '完成' : '下一步'}
      </Tour.Control>
    </div>
  )
}

export function PlacementTourDemo() {
  return (
    <Card title="位置" description="主方向决定浮层在哪一侧，后缀决定与目标的边缘对齐方式。">
      <Tour.Root>
        <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-3">
          {placements.map((placement) => (
            <Tour.Target<HTMLDivElement> key={placement} name={`placement-${placement}`}>
              {(props) => (
                <div
                  {...props}
                  role="button"
                  tabIndex={0}
                  className="flex h-12 w-36 items-center justify-center justify-self-center rounded-md border border-border px-3 text-sm"
                >
                  {placement}
                </div>
              )}
            </Tour.Target>
          ))}
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          {placements.map((placement) => (
            <Tour.Step key={placement} name={`placement-${placement}`} target={`placement-${placement}`} placement={placement}>
              <Tour.Content>
                <Tour.Arrow />
                <TourPanel title={placement} description={`当前浮层位于目标的 ${placement} 方向。`}>
                  <PlacementActions />
                </TourPanel>
              </Tour.Content>
            </Tour.Step>
          ))}
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
