import type { LinearGradientInput } from '@fex-design/core/gradient/types'
import { formatLinearGradient } from '@fex-design/core/gradient/gradient'
import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannel,
  ColorPickerChannelThumb,
  ColorPickerChannelTrack,
  ColorPickerRoot,
  GradientPickerRoot,
  GradientPickerStop,
  GradientPickerTrack,
  useColorPicker,
  useGradientPicker,
} from '@fex-design/react/primitive/color-picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@fex-design/react/primitive/popover'
import { Card } from '@fex-design/react/ui/card'

const initial: LinearGradientInput = {
  type: 'linear-gradient',
  angle: 90,
  interpolation: 'oklch',
  stops: [
    { id: 'start', color: 'rgb(16 142 233)', position: 0 },
    { id: 'end', color: 'rgb(135 208 104)', position: 1 },
  ],
}

function StopColorPanel() {
  const { controller, snapshot } = useColorPicker()
  return (
    <>
      <ColorPickerArea xChannel="hsb-saturation" yChannel="hsb-brightness">
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerChannel channel="hsb-hue">
        <ColorPickerChannelTrack />
        <ColorPickerChannelThumb />
      </ColorPickerChannel>
      <ColorPickerChannel channel="alpha">
        <ColorPickerChannelTrack />
        <ColorPickerChannelThumb />
      </ColorPickerChannel>
      <div className="flex items-center gap-2">
        <span className="text-sm">HEX</span>
        <input
          className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm"
          value={snapshot.value?.toHex() ?? ''}
          onChange={(event) => controller.setValue(event.target.value, 'text-input')}
          onBlur={() => controller.completeInteraction()}
        />
        <span className="text-sm">{Math.round((snapshot.value?.alpha ?? 1) * 100)}%</span>
      </div>
    </>
  )
}

function GradientEditor() {
  const { controller, snapshot } = useGradientPicker()
  const selected =
    snapshot.value.stops.find((stop) => stop.id === snapshot.selectedStopId) ??
    snapshot.value.stops[0]
  if (!selected) return null
  const gradient = formatLinearGradient(snapshot.value)
  return (
    <PopoverRoot>
      <PopoverTrigger>
        {(props) => (
          <button
            {...props}
            className="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 text-sm"
          >
            <span className="size-6 shrink-0 rounded" style={{ background: gradient }} />
            <span className="truncate">
              {snapshot.value.stops
                .map((stop) => `${stop.color.toString('rgb')} ${Math.round(stop.position * 100)}%`)
                .join(', ')}
            </span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <ColorPickerRoot
            value={selected.color}
            defaultFormat="rgb"
            onChange={(color) => color && controller.setStopColor(selected.id, color)}
            onChangeComplete={(color) => color && controller.setStopColor(selected.id, color, true)}
          >
            <div className="grid w-80 max-w-full gap-3">
              <GradientPickerTrack>
                {snapshot.value.stops.map((stop) => (
                  <GradientPickerStop
                    key={stop.id}
                    id={stop.id}
                    aria-label={`${Math.round(stop.position * 100)}% color stop`}
                  />
                ))}
              </GradientPickerTrack>
              <StopColorPanel />
            </div>
          </ColorPickerRoot>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}

export function GradientDemo() {
  return (
    <Card
      title="渐变色"
      description="选择色标后编辑当前颜色；点击轨道新增色标，拖动色标调整位置，使用 OKLCH 插值。"
    >
      <GradientPickerRoot defaultValue={initial}>
        <GradientEditor />
      </GradientPickerRoot>
    </Card>
  )
}
