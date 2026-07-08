import { createSliderController } from '@fex/components-core/slider/create-slider-controller'
import type { SliderOrientation } from '@fex/components-core/slider/types'
import { convertValueToPercentage, getSliderValueFromPointer } from '@fex/components-core/slider/utils'
import {
  sliderRangeClassName,
  sliderRootClassName,
  sliderThumbClassName,
  sliderTrackClassName,
  type SliderStyleProps,
} from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { computed, defineComponent, h, provide, inject, ref, watchEffect, type PropType, type Ref } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

type SliderController = ReturnType<typeof createSliderController>
type SliderContext = {
  controller: SliderController
  snapshot: Ref<ReturnType<SliderController['getSnapshot']>>
  rootElement: Ref<HTMLDivElement | undefined>
}

const SliderContextKey = Symbol('SliderContext')

function useSliderContext(componentName: string) {
  const context = inject<SliderContext>(SliderContextKey)
  if (!context) {
    throw new Error(`${componentName} must be used inside SliderRoot.`)
  }
  return context
}

export const SliderRoot = defineComponent({
  name: 'SliderRoot',
  inheritAttrs: false,
  props: {
    value: { type: Array as PropType<number[] | undefined>, default: undefined },
    defaultValue: { type: Array as PropType<number[] | undefined>, default: undefined },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    minStepsBetweenThumbs: { type: Number, default: 0 },
    orientation: { type: String as PropType<SliderOrientation>, default: 'horizontal' },
    disabled: Boolean,
    size: { type: String as PropType<SliderStyleProps['size']>, default: 'default' },
  },
  emits: {
    valueChange: (_value: number[]) => true,
    valueCommit: (_value: number[]) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const rootElement = ref<HTMLDivElement>()
    const options = {
      value: props.value,
      defaultValue: props.defaultValue,
      min: props.min,
      max: props.max,
      step: props.step,
      minStepsBetweenThumbs: props.minStepsBetweenThumbs,
      orientation: props.orientation,
      disabled: props.disabled,
      onChange: (value: number[]) => emit('valueChange', value),
      onCommit: (value: number[]) => emit('valueCommit', value),
    }
    const controller = createSliderController(options)
    const snapshot = useCoreStore(controller)

    watchEffect(() => {
      Object.assign(options, {
        value: props.value,
        defaultValue: props.defaultValue,
        min: props.min,
        max: props.max,
        step: props.step,
        minStepsBetweenThumbs: props.minStepsBetweenThumbs,
        orientation: props.orientation,
        disabled: props.disabled,
      })
      controller.syncSnapshot()
    })

    provide(SliderContextKey, { controller, snapshot, rootElement })

    return () => {
      const currentSnapshot = snapshot.value

      return h(
        'div',
        {
          ...attrs,
          ref: rootElement,
          'data-disabled': currentSnapshot.disabled ? 'true' : undefined,
          'data-orientation': currentSnapshot.orientation,
          class: cn(sliderRootClassName({ size: props.size, orientation: currentSnapshot.orientation }), attrs.class as string | undefined),
          onPointerdown: (event: PointerEvent) => {
            if (event.defaultPrevented || currentSnapshot.disabled || !rootElement.value) return
            rootElement.value.setPointerCapture(event.pointerId)
            controller.startSlide(
              getSliderValueFromPointer(event.clientX, event.clientY, rootElement.value.getBoundingClientRect(), currentSnapshot.min, currentSnapshot.max, currentSnapshot.orientation),
            )
          },
          onPointermove: (event: PointerEvent) => {
            if (event.defaultPrevented || currentSnapshot.disabled || !rootElement.value?.hasPointerCapture(event.pointerId)) return
            controller.moveSlide(
              getSliderValueFromPointer(event.clientX, event.clientY, rootElement.value.getBoundingClientRect(), currentSnapshot.min, currentSnapshot.max, currentSnapshot.orientation),
            )
          },
          onPointerup: (event: PointerEvent) => {
            if (!rootElement.value?.hasPointerCapture(event.pointerId)) return
            rootElement.value.releasePointerCapture(event.pointerId)
            controller.endSlide()
          },
        },
        slots.default?.({ values: currentSnapshot.values, snapshot: currentSnapshot }),
      )
    }
  },
})

export const SliderTrack = defineComponent({
  name: 'SliderTrack',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const { snapshot } = useSliderContext('SliderTrack')
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-disabled': snapshot.value.disabled ? 'true' : undefined,
          'data-orientation': snapshot.value.orientation,
          class: cn(sliderTrackClassName, attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const SliderRange = defineComponent({
  name: 'SliderRange',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { snapshot } = useSliderContext('SliderRange')
    const rangeStyle = computed(() => {
      const percentages = snapshot.value.values.map((value) => convertValueToPercentage(value, snapshot.value.min, snapshot.value.max))
      const start = snapshot.value.values.length > 1 ? Math.min(...percentages) : 0
      const end = 100 - Math.max(...percentages)
      return snapshot.value.orientation === 'vertical' ? { bottom: `${start}%`, top: `${end}%` } : { left: `${start}%`, right: `${end}%` }
    })

    return () =>
      h('span', {
        ...attrs,
        'data-disabled': snapshot.value.disabled ? 'true' : undefined,
        'data-orientation': snapshot.value.orientation,
        class: cn(sliderRangeClassName, attrs.class as string | undefined),
        style: [rangeStyle.value, attrs.style],
      })
  },
})

export const SliderThumb = defineComponent({
  name: 'SliderThumb',
  inheritAttrs: false,
  props: {
    index: { type: Number, default: 0 },
  },
  setup(props, { attrs }) {
    const context = useSliderContext('SliderThumb')
    const thumbStyle = computed(() => {
      const value = context.snapshot.value.values[props.index] ?? context.snapshot.value.min
      const percent = convertValueToPercentage(value, context.snapshot.value.min, context.snapshot.value.max)
      return context.snapshot.value.orientation === 'vertical'
        ? { position: 'absolute', bottom: `${percent}%`, left: '50%', transform: 'translate(-50%, 50%)' }
        : { position: 'absolute', top: '50%', left: `${percent}%`, transform: 'translate(-50%, -50%)' }
    })

    function handleKeydown(event: KeyboardEvent) {
      const snapshot = context.snapshot.value
      if (snapshot.disabled) return
      const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
      if (event.key === 'Home') {
        event.preventDefault()
        context.controller.setValueAt(props.index, snapshot.min, { commit: true })
      } else if (event.key === 'End') {
        event.preventDefault()
        context.controller.setValueAt(props.index, snapshot.max, { commit: true })
      } else if (event.key in keyMap) {
        event.preventDefault()
        const direction = keyMap[event.key]!
        context.controller.stepThumb(props.index, direction > 0 ? 1 : -1, Math.abs(direction))
      }
    }

    return () => {
      const snapshot = context.snapshot.value
      const value = snapshot.values[props.index] ?? snapshot.min
      return h('span', {
        ...attrs,
        role: 'slider',
        tabindex: snapshot.disabled ? undefined : 0,
        'aria-valuemin': snapshot.min,
        'aria-valuemax': snapshot.max,
        'aria-valuenow': value,
        'aria-disabled': snapshot.disabled ? true : undefined,
        'data-disabled': snapshot.disabled ? 'true' : undefined,
        'data-orientation': snapshot.orientation,
        class: cn(sliderThumbClassName, attrs.class as string | undefined),
        style: [thumbStyle.value, attrs.style],
        onFocus: () => context.controller.setActiveIndex(props.index),
        onKeydown: handleKeydown,
      })
    }
  },
})
