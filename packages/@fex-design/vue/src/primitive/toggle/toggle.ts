import { createToggleGroupController } from '@fex-design/core/toggle/create-toggle-group-controller'
import { getToggleGroupFocusIndex, type ToggleGroupChangeMeta, type ToggleGroupValue } from '@fex-design/core/toggle/types'
import { toggleClassName, toggleGroupClassName, type ToggleStyleProps } from '@fex-design/styles/toggle'
import { cn } from '@fex/utils'
import { computed, defineComponent, h, inject, provide, ref, type PropType } from 'vue'
import Button from '../button/button.vue'

type Variant = NonNullable<ToggleStyleProps['variant']>
type Size = NonNullable<ToggleStyleProps['size']>
type GroupContext = { disabled: () => boolean; variant: () => Variant; size: () => Size; isPressed: (value: string) => boolean; toggle: (value: string) => void }
const groupKey = Symbol('ToggleGroup')

export const Toggle = defineComponent({
  name: 'FexToggle', inheritAttrs: false,
  props: { pressed: { type: Boolean, default: undefined }, defaultPressed: Boolean, value: String, disabled: Boolean, variant: String as PropType<Variant>, size: String as PropType<Size> },
  emits: { change: (_pressed: boolean) => true },
  setup(props, { attrs, emit, slots }) {
    const group = inject<GroupContext | null>(groupKey, null)
    const internal = ref(props.defaultPressed)
    const inGroup = computed(() => group !== null && props.value !== undefined)
    const current = computed(() => inGroup.value ? group!.isPressed(props.value!) : (props.pressed ?? internal.value))
    return () => h(Button, { ...attrs, disabled: props.disabled || group?.disabled(), 'aria-pressed': current.value, 'data-slot': 'toggle', 'data-state': current.value ? 'on' : 'off', 'data-value': props.value, class: cn(toggleClassName({ variant: props.variant ?? group?.variant(), size: props.size ?? group?.size() }), attrs.class as string | undefined), onClick: (event: MouseEvent) => { const handler = attrs.onClick as ((event: MouseEvent) => void) | undefined; handler?.(event); if (event.defaultPrevented || props.disabled || group?.disabled()) return; if (inGroup.value) group!.toggle(props.value!); else { const next = !current.value; if (props.pressed === undefined) internal.value = next; emit('change', next) } } }, slots)
  },
})

export const ToggleGroup = defineComponent({
  name: 'FexToggleGroup', inheritAttrs: false,
  props: { multiple: Boolean, value: [String, Array] as PropType<ToggleGroupValue>, defaultValue: [String, Array] as PropType<ToggleGroupValue>, disabled: Boolean, orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' }, spacing: { type: Number, default: 8 }, variant: { type: String as PropType<Variant>, default: 'default' }, size: { type: String as PropType<Size>, default: 'default' } },
  emits: { change: (_value: ToggleGroupValue, _meta: ToggleGroupChangeMeta) => true },
  setup(props, { attrs, emit, slots }) {
    const version = ref(0)
    const controller = createToggleGroupController({ get multiple() { return props.multiple }, get value() { return props.value }, get defaultValue() { return props.defaultValue }, get disabled() { return props.disabled }, onChange(value, meta) { emit('change', value, meta) } })
    controller.subscribe(() => { version.value += 1 })
    provide<GroupContext>(groupKey, { disabled: () => props.disabled, variant: () => props.variant, size: () => props.size, isPressed: (value) => { version.value; return controller.isPressed(value) }, toggle: (value) => { controller.toggle(value) } })
    return () => h('div', { ...attrs, role: 'group', 'aria-orientation': props.orientation, 'data-slot': 'toggle-group', 'data-orientation': props.orientation, 'data-variant': props.variant, 'data-disabled': props.disabled ? 'true' : undefined, class: cn(toggleGroupClassName({ orientation: props.orientation, variant: props.variant, connected: props.spacing === 0 }), attrs.class as string | undefined), style: [{ gap: props.spacing > 0 ? `${props.spacing}px` : undefined }, attrs.style], onKeydown: (event: KeyboardEvent) => { const handler = attrs.onKeydown as ((event: KeyboardEvent) => void) | undefined; handler?.(event); if (event.defaultPrevented) return; const currentTarget = event.currentTarget as HTMLDivElement; const items = [...currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot=toggle]:not(:disabled)')]; const index = items.indexOf(event.target as HTMLButtonElement); const next = getToggleGroupFocusIndex(event.key, index, items.length, props.orientation); if (next === undefined || next === index) return; event.preventDefault(); items[next]?.focus() } }, slots.default?.())
  },
})

export default Toggle
