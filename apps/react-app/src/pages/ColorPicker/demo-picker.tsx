import { getColorChannelConfig, getColorChannelValue } from '@fex-design/core/color-picker/channels'
import { parseColor } from '@fex-design/core/color/color'
import type { ColorFormat } from '@fex-design/core/color/types'
import { ChevronDownIcon } from '@fex-design/react/icon/chevron'
import { InputControl, InputRoot } from '@fex-design/react/primitive/input'
import { InputNumber } from '@fex-design/react/primitive/input-number'
import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannel,
  ColorPickerChannelThumb,
  ColorPickerChannelTrack,
  ColorPickerRoot,
  ColorPickerSwatch,
  useColorPicker,
} from '@fex-design/react/primitive/color-picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@fex-design/react/primitive/popover'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/react/primitive/select'
import { useState, type ReactNode } from 'react'

const formats: ColorFormat[] = ['hex', 'rgb', 'hsl', 'hsb', 'oklch']
const formatOptions = formats.map((format) => ({ value: format, label: format.toUpperCase() }))

function ColorTextInput({ value }: { value: string }) {
  const { controller } = useColorPicker()
  const [draft, setDraft] = useState(value)
  const [editing, setEditing] = useState(false)
  const commit = () => {
    const parsed = parseColor(draft)
    if (parsed) controller.setValue(parsed, 'text-input', true)
    else setDraft(value)
    setEditing(false)
  }
  return (
    <InputRoot
      value={editing ? draft : value}
      onValueChange={(next) => {
        setDraft(next)
        const parsed = parseColor(next)
        if (parsed) controller.setValue(parsed, 'text-input')
      }}
    >
      <InputControl
        aria-label="颜色值"
        onFocus={() => {
          setDraft(value)
          setEditing(true)
          controller.beginInteraction({ source: 'text-input' })
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
          if (event.key === 'Escape') {
            setDraft(value)
            event.currentTarget.blur()
          }
        }}
      />
    </InputRoot>
  )
}
function PickerPanel({ alpha = true, clear = false }: { alpha?: boolean; clear?: boolean }) {
  const { controller, snapshot } = useColorPicker()
  const value = snapshot.value
  const fields =
    snapshot.format === 'rgb'
      ? (['red', 'green', 'blue'] as const)
      : snapshot.format === 'hsl'
        ? (['hsl-hue', 'hsl-saturation', 'hsl-lightness'] as const)
        : snapshot.format === 'hsb'
          ? (['hsb-hue', 'hsb-saturation', 'hsb-brightness'] as const)
          : snapshot.format === 'oklch'
            ? (['oklch-lightness', 'oklch-chroma', 'oklch-hue'] as const)
            : []
  return (
    <div className="grid w-80 max-w-full min-w-0 content-start gap-3">
      {clear ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => controller.clear()}
            aria-label="清除颜色"
            className="relative size-7 cursor-pointer overflow-hidden rounded-md border border-border bg-background after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-danger after:content-[''] hover:border-primary"
          >
            <span className="sr-only">清除颜色</span>
          </button>
        </div>
      ) : null}
      <ColorPickerArea xChannel="hsb-saturation" yChannel="hsb-brightness">
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerChannel channel="hsb-hue">
        <ColorPickerChannelTrack />
        <ColorPickerChannelThumb />
      </ColorPickerChannel>
      {alpha ? (
        <div className="grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3">
          <ColorPickerChannel channel="alpha">
            <ColorPickerChannelTrack />
            <ColorPickerChannelThumb />
          </ColorPickerChannel>
          <ColorPickerSwatch />
        </div>
      ) : null}
      <div className="grid min-w-0 gap-2">
        <div className="min-w-0">
          <SelectRoot
            options={formatOptions}
            value={snapshot.format}
            onChange={(format) => controller.setFormat(format as ColorFormat)}
          >
            <SelectTrigger />
            <SelectContent>
              <SelectList />
            </SelectContent>
          </SelectRoot>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {snapshot.format === 'hex' ? (
            <div className="min-w-0 flex-1"><ColorTextInput value={value?.toHex() ?? ''} /></div>
          ) : (
            <div className="grid min-w-0 flex-1 grid-flow-col auto-cols-fr gap-2">
              {fields.map((channel) => {
                const config = getColorChannelConfig(channel)
                return (
                  <InputNumber
                    key={channel}
                    className="min-w-0"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value ? getColorChannelValue(value, channel) : undefined}
                    onChange={(_, next) => next !== undefined && controller.setChannel(channel, next, 'field')}
                    onBlur={() => controller.completeInteraction()}
                  />
                )
              })}
            </div>
          )}
          {alpha ? (
            <InputNumber
              className="w-20 shrink-0"
              value={Math.round((value?.alpha ?? 1) * 100)}
              suffix="%"
              readOnly
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
function DefaultTrigger({ text = false }: { text?: boolean }) {
  const { snapshot } = useColorPicker()
  return (
    <PopoverTrigger>
      {(props) => (
        <button
          {...props}
          disabled={snapshot.disabled}
          data-disabled={snapshot.disabled || undefined}
          className="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 transition-colors data-disabled:cursor-not-allowed data-disabled:border-input-border data-disabled:bg-muted-background data-disabled:opacity-50"
        >
          <ColorPickerSwatch />
          {text ? (
            <span className="text-sm">
              {snapshot.format.toUpperCase()}:{' '}
              {snapshot.value?.toString(snapshot.format) ?? '未选择'}
            </span>
          ) : null}
        </button>
      )}
    </PopoverTrigger>
  )
}
export function PopupPicker({
  value,
  defaultValue = '#1677FF',
  onChange,
  disabled = false,
  alpha = true,
  clear = false,
  text = false,
  trigger = 'click',
}: {
  value?: string | null
  defaultValue?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  alpha?: boolean
  clear?: boolean
  text?: boolean
  trigger?: 'click' | 'hover'
}) {
  return (
    <ColorPickerRoot
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={(next) => onChange?.(next?.toString('oklch') ?? null)}
    >
      <PopoverRoot trigger={[trigger]}>
        <DefaultTrigger text={text} />
        <PopoverPortal>
          <PopoverContent>
            <PickerPanel alpha={alpha} clear={clear} />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </ColorPickerRoot>
  )
}
export function InlinePicker({ oklch = false }: { oklch?: boolean }) {
  return (
    <ColorPickerRoot defaultValue="oklch(0.61 0.22 264)" defaultFormat="oklch">
      <div className="grid max-w-sm gap-3">
        <ColorPickerArea
          xChannel={oklch ? 'oklch-chroma' : 'hsb-saturation'}
          yChannel={oklch ? 'oklch-lightness' : 'hsb-brightness'}
        >
          <ColorPickerAreaThumb />
        </ColorPickerArea>
        <ColorPickerChannel channel={oklch ? 'oklch-hue' : 'hsb-hue'}>
          <ColorPickerChannelTrack />
          <ColorPickerChannelThumb />
        </ColorPickerChannel>
      </div>
    </ColorPickerRoot>
  )
}
export function ControlledPicker() {
  const [value, setValue] = useState<string | null>('#1677FF')
  return (
    <div className="grid items-start gap-3">
      <PopupPicker value={value} onChange={setValue} />
      <code className="text-xs text-muted-foreground">{value}</code>
    </div>
  )
}
function PresetPanel({ select }: { select: (color: string) => void }) {
  const groups = [
    [
      'primary',
      [
        '#E6F4FF',
        '#91CAFF',
        '#69B1FF',
        '#4096FF',
        '#1677FF',
        '#0958D9',
        '#003EB3',
        '#002C8C',
        '#001D66',
      ],
    ],
    [
      'red',
      [
        '#FFF1F0',
        '#FFCCC7',
        '#FFA39E',
        '#FF7875',
        '#FF4D4F',
        '#F5222D',
        '#CF1322',
        '#A8071A',
        '#820014',
      ],
    ],
    [
      'green',
      [
        '#F6FFED',
        '#D9F7BE',
        '#B7EB8F',
        '#95DE64',
        '#73D13D',
        '#52C41A',
        '#389E0D',
        '#237804',
        '#135200',
      ],
    ],
    [
      'cyan',
      [
        '#E6FFFB',
        '#B5F5EC',
        '#87E8DE',
        '#5CDBD3',
        '#36CFC9',
        '#13C2C2',
        '#08979C',
        '#006D75',
        '#00474F',
      ],
    ],
  ] as const
  return (
    <div className="grid min-w-0 content-start gap-3 border-b border-border pb-3 sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0">
      {groups.map(([label, colors]) => (
        <section key={label}>
          <button
            type="button"
            className="mb-2 flex h-5 cursor-pointer items-center gap-2 text-xs text-muted-foreground"
          >
            <ChevronDownIcon className="size-3" aria-hidden />
            <span>{label}</span>
          </button>
          <div className="grid w-max grid-cols-7 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className="size-6 cursor-pointer rounded border border-border"
                style={{ background: color }}
                aria-label={color}
                onClick={() => select(color)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
export function PresetPicker() {
  const [value, setValue] = useState<string | null>('#1677FF')
  return (
    <ColorPickerRoot value={value} onChange={(next) => setValue(next?.toString('oklch') ?? null)}>
      <PopoverRoot placement="bottomLeft">
        <DefaultTrigger />
        <PopoverPortal>
          <PopoverContent className="w-max max-w-[calc(100vw-24px)] overflow-visible [--popover-content-max-width:calc(100vw-24px)]">
            <div className="grid min-w-0 gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]">
              <PresetPanel select={setValue} />
              <PickerPanel />
            </div>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </ColorPickerRoot>
  )
}
export function DemoFrame({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-start gap-3">{children}</div>
}
