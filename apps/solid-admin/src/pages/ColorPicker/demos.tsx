import { formatLinearGradient } from '@fex-design/core/gradient/gradient'
import type { LinearGradientInput } from '@fex-design/core/gradient/types'
import {
  ColorPickerRoot,
  GradientPickerRoot,
  GradientPickerStop,
  GradientPickerTrack,
  useGradientPicker,
} from '@fex-design/solid/primitive/color-picker'
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@fex-design/solid/primitive/popover'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { DemoPicker, PickerPanel, PresetPicker } from './demo-picker'
export function BasicDemo() {
  return (
    <Card title="基本使用" description="选择颜色并通过输入框双向编辑。">
      <DemoPicker />
    </Card>
  )
}
export function ControlledDemo() {
  return (
    <Card title="受控模式" description="外部值通过 onChange 回流。">
      <DemoPicker controlled />
    </Card>
  )
}
const gradientInitial: LinearGradientInput = {
  type: 'linear-gradient',
  angle: 90,
  interpolation: 'oklch',
  stops: [
    { id: 'start', color: 'rgb(16 142 233)', position: 0 },
    { id: 'end', color: 'rgb(135 208 104)', position: 1 },
  ],
}
function GradientEditor() {
  const picker = useGradientPicker()
  const selected = () =>
    picker.snapshot().value.stops.find((stop) => stop.id === picker.snapshot().selectedStopId) ??
    picker.snapshot().value.stops[0]
  return (
    <Popover>
      <PopoverTrigger>
        {(slot) => (
          <button
            {...slot.props}
            ref={slot.ref}
          class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 text-sm"
          >
            <span
              class="size-6 shrink-0 rounded"
              style={{ background: formatLinearGradient(picker.snapshot().value) }}
            />
            <span class="truncate">
              {picker
                .snapshot()
                .value.stops.map(
                  (stop) => `${stop.color.toString('rgb')} ${Math.round(stop.position * 100)}%`,
                )
                .join(', ')}
            </span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <ColorPickerRoot
            value={selected()?.color}
            defaultFormat="rgb"
            onChange={(value) =>
              value && picker.controller.setStopColor(picker.snapshot().selectedStopId, value)
            }
          >
            <div class="grid w-80 gap-3">
              <GradientPickerTrack>
                <For each={picker.snapshot().value.stops}>
                  {(stop) => <GradientPickerStop id={stop.id} />}
                </For>
              </GradientPickerTrack>
              <PickerPanel />
            </div>
          </ColorPickerRoot>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}
export function GradientDemo() {
  return (
    <Card
      title="渐变色"
      description="选择色标后编辑当前颜色；点击轨道新增色标，拖动色标调整位置，使用 OKLCH 插值。"
    >
      <GradientPickerRoot defaultValue={gradientInitial}>
        <GradientEditor />
      </GradientPickerRoot>
    </Card>
  )
}
export function TriggerTextDemo() {
  return (
    <Card title="渲染触发器文本" description="触发器组合当前编码文本。">
      <DemoPicker text />
    </Card>
  )
}
export function DisabledDemo() {
  return (
    <Card title="禁用" description="disabled 阻止交互。">
      <DemoPicker disabled />
    </Card>
  )
}
export function DisabledAlphaDemo() {
  return (
    <Card title="禁用透明度" description="不组合 Alpha 通道。">
      <DemoPicker alpha={false} />
    </Card>
  )
}
export function ClearDemo() {
  return (
    <Card title="清除颜色" description="清除值为 null。">
      <DemoPicker clear />
    </Card>
  )
}
export function CustomTriggerDemo() {
  return (
    <Card title="自定义触发器" description="PopoverTrigger 自由组合。">
      <DemoPicker text />
    </Card>
  )
}
export function CustomTriggerEventDemo() {
  return (
    <Card title="自定义触发事件" description="这里使用 hover。">
      <DemoPicker hover text />
    </Card>
  )
}
export function FormatDemo() {
  return (
    <Card title="颜色编码" description="HEX、RGB、HSL、HSB 与 OKLCH。">
      <DemoPicker text />
    </Card>
  )
}
export function PresetsDemo() {
  return (
    <Card title="预设颜色" description="打开面板后，可从预设分组选择颜色，也可使用右侧完整选择器编辑。">
      <PresetPicker />
    </Card>
  )
}
export function CustomPanelDemo() {
  return (
    <Card title="自定义面板" description="OKLCH 原生面板。">
      <DemoPicker inline oklch />
    </Card>
  )
}
