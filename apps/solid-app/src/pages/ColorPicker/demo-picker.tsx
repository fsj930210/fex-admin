import { getColorChannelConfig, getColorChannelValue } from '@fex-design/core/color-picker/channels'
import { parseColor } from '@fex-design/core/color/color'
import type { ColorFormat } from '@fex-design/core/color/types'
import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannel,
  ColorPickerChannelThumb,
  ColorPickerChannelTrack,
  ColorPickerRoot,
  ColorPickerSwatch,
  useColorPicker,
} from '@fex-design/solid/primitive/color-picker'
import { InputControl, InputRoot } from '@fex-design/solid/primitive/input'
import { InputNumber } from '@fex-design/solid/primitive/input-number'
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@fex-design/solid/primitive/popover'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex-design/solid/primitive/select'
import { ChevronDownIcon } from '@fex-design/solid/icon/chevron'
import { createSignal, For, Show } from 'solid-js'
const formats: ColorFormat[] = ['hex', 'rgb', 'hsl', 'hsb', 'oklch'],
  options = formats.map((value) => ({ value, label: value.toUpperCase() }))
function ColorTextInput(props: { value: string }) {
  const picker = useColorPicker(),
    [draft, setDraft] = createSignal(props.value),
    [editing, setEditing] = createSignal(false)
  const input = () => (editing() ? draft() : props.value)
  const change = (next: string) => {
    setDraft(next)
    const parsed = parseColor(next)
    if (parsed) picker.controller.setValue(parsed, 'text-input')
  }
  const commit = () => {
    const parsed = parseColor(draft())
    if (parsed) picker.controller.setValue(parsed, 'text-input', true)
    else setDraft(props.value)
    setEditing(false)
  }
  return (
    <InputRoot value={input()} onValueChange={change}>
      <InputControl
        aria-label="颜色值"
        onFocus={() => {
          setDraft(props.value)
          setEditing(true)
          picker.controller.beginInteraction({ source: 'text-input' })
        }}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
    </InputRoot>
  )
}
export function PickerPanel(props: { alpha?: boolean; clear?: boolean; oklch?: boolean }) {
  const picker = useColorPicker()
  const fields = () =>
    picker.snapshot().format === 'rgb'
      ? (['red', 'green', 'blue'] as const)
      : picker.snapshot().format === 'hsl'
        ? (['hsl-hue', 'hsl-saturation', 'hsl-lightness'] as const)
        : picker.snapshot().format === 'hsb'
          ? (['hsb-hue', 'hsb-saturation', 'hsb-brightness'] as const)
          : picker.snapshot().format === 'oklch'
            ? (['oklch-lightness', 'oklch-chroma', 'oklch-hue'] as const)
            : []
  return (
    <div class="grid w-80 max-w-[calc(100vw-48px)] min-w-0 content-start gap-3">
      <Show when={props.clear}>
        <div class="flex justify-end">
          <button
            type="button"
            aria-label="清除颜色"
            class="relative size-7 cursor-pointer overflow-hidden rounded-md border border-border bg-background after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-danger after:content-['']"
            onClick={() => picker.controller.clear()}
          />
        </div>
      </Show>
      <ColorPickerArea
        xChannel={props.oklch ? 'oklch-chroma' : 'hsb-saturation'}
        yChannel={props.oklch ? 'oklch-lightness' : 'hsb-brightness'}
      >
        <ColorPickerAreaThumb />
      </ColorPickerArea>
      <ColorPickerChannel channel={props.oklch ? 'oklch-hue' : 'hsb-hue'}>
        <ColorPickerChannelTrack />
        <ColorPickerChannelThumb />
      </ColorPickerChannel>
      <Show when={props.alpha !== false}>
        <div class="grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3">
          <ColorPickerChannel channel="alpha">
            <ColorPickerChannelTrack />
            <ColorPickerChannelThumb />
          </ColorPickerChannel>
          <ColorPickerSwatch />
        </div>
      </Show>
      <SelectRoot
        options={options}
        value={picker.snapshot().format}
        onChange={(format) => picker.controller.setFormat(format as ColorFormat)}
      >
        <SelectTrigger />
        <SelectContent />
      </SelectRoot>
      <div class="flex min-w-0 items-center gap-2">
        <Show
          when={picker.snapshot().format === 'hex'}
          fallback={
            <div class="grid min-w-0 flex-1 grid-flow-col auto-cols-fr gap-2">
              <For each={fields()}>
                {(channel) => {
                  const c = getColorChannelConfig(channel)
                  return (
                    <InputNumber
                      class="min-w-0"
                      min={c.min}
                      max={c.max}
                      step={c.step}
                      value={
                        picker.snapshot().value
                          ? getColorChannelValue(picker.snapshot().value!, channel)
                          : undefined
                      }
                      onChange={(_, next) => next !== undefined && picker.controller.setChannel(channel, next, 'field')}
                      onBlur={() => picker.controller.completeInteraction()}
                    />
                  )
                }}
              </For>
            </div>
          }
        >
          <div class="min-w-0 flex-1">
            <ColorTextInput value={picker.snapshot().value?.toHex() ?? ''} />
          </div>
        </Show>
        <Show when={props.alpha !== false}>
          <InputNumber
            class="w-20 shrink-0"
            value={Math.round((picker.snapshot().value?.alpha ?? 1) * 100)}
            suffix="%"
            readOnly
          />
        </Show>
      </div>
    </div>
  )
}
function Surface(props: {
  alpha?: boolean
  clear?: boolean
  text?: boolean
  hover?: boolean
  inline?: boolean
  oklch?: boolean
}) {
  const picker = useColorPicker()
  return (
    <Show when={!props.inline} fallback={<PickerPanel {...props} />}>
      <Popover trigger={[props.hover ? 'hover' : 'click']}>
        <PopoverTrigger>
          {(slot) => (
            <button
              {...slot.props}
              ref={slot.ref}
              disabled={picker.snapshot().disabled}
              data-disabled={picker.snapshot().disabled || undefined}
              class="inline-flex h-9 w-fit max-w-full self-start items-center gap-2 rounded-md border border-border bg-background px-2 data-disabled:cursor-not-allowed data-disabled:bg-muted-background data-disabled:opacity-50"
            >
              <ColorPickerSwatch />
              <Show when={props.text}>
                <span class="text-sm">
                  {picker.snapshot().format.toUpperCase()}:{' '}
                  {picker.snapshot().value?.toString(picker.snapshot().format) ?? '未选择'}
                </span>
              </Show>
            </button>
          )}
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent>
            <PickerPanel {...props} />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </Show>
  )
}
export function DemoPicker(props: {
  controlled?: boolean
  alpha?: boolean
  clear?: boolean
  text?: boolean
  hover?: boolean
  disabled?: boolean
  inline?: boolean
  oklch?: boolean
}) {
  const [value, setValue] = createSignal<string | null>('#1677FF')
  return (
    <div class="grid items-start gap-2">
      <ColorPickerRoot
        value={props.controlled ? value() : undefined}
        defaultValue="#1677FF"
        disabled={props.disabled}
        onChange={(next) => props.controlled && setValue(next?.toString('oklch') ?? null)}
      >
        <Surface {...props} />
      </ColorPickerRoot>
      <Show when={props.controlled}>
        <code class="text-xs text-muted-foreground">{value()}</code>
      </Show>
    </div>
  )
}
export function PresetPicker() {
  const [value, setValue] = createSignal('#1677FF'),
    groups = [
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
    <ColorPickerRoot
      value={value()}
      onChange={(next) => setValue(next?.toString('oklch') ?? value())}
    >
      <Popover placement="bottomLeft">
        <PopoverTrigger>
          {(slot) => (
            <button
              {...slot.props}
              ref={slot.ref}
              class="inline-flex h-9 w-fit max-w-full self-start items-center rounded-md border border-border bg-background px-2"
            >
              <ColorPickerSwatch />
            </button>
          )}
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class="w-max max-w-[calc(100vw-24px)] overflow-visible [--popover-content-max-width:calc(100vw-24px)]">
            <div class="grid gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]">
              <div class="grid content-start gap-3 border-b border-border pb-3 sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0">
                <For each={groups}>
                  {([label, colors]) => (
                    <section>
                      <button class="mb-2 flex h-5 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                        <ChevronDownIcon class="size-3" />
                        <span>{label}</span>
                      </button>
                      <div class="grid w-max grid-cols-7 gap-2">
                        <For each={colors}>
                          {(color) => (
                            <button
                              class="size-6 cursor-pointer rounded border border-border"
                              style={{ background: color }}
                              aria-label={color}
                              onClick={() => setValue(color)}
                            />
                          )}
                        </For>
                      </div>
                    </section>
                  )}
                </For>
              </div>
              <PickerPanel />
            </div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </ColorPickerRoot>
  )
}
