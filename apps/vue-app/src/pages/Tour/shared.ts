import { defineComponent, h } from 'vue'
import { CloseIcon } from '@fex-design/vue/icon/close'
import { TourControl, TourTarget, useTour } from '@fex-design/vue/primitive/tour'

export const DemoTarget = defineComponent({
  props: { name: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h(TourTarget, { name: props.name }, {
      default: (slot: { props: Record<string, unknown>; ref: (element: HTMLElement | null) => void }) => h('div', {
        ...slot.props, ref: slot.ref, role: 'button', tabindex: 0,
        class: 'inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background',
      }, slots.default?.()),
    })
  },
})

export const StartTourButton = defineComponent({
  setup() {
    const tour = useTour()
    return () => h('button', { type: 'button', class: 'inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90', onClick: () => tour.open() }, '开始引导')
  },
})

export const TourProgress = defineComponent({
  setup() {
    const { snapshot } = useTour()
    return () => {
      const progress = snapshot.value.total > 0 ? ((snapshot.value.currentIndex + 1) / snapshot.value.total) * 100 : 0
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'shrink-0 text-xs tabular-nums text-muted-foreground' }, `${snapshot.value.currentIndex + 1} / ${snapshot.value.total}`),
        h('div', { class: 'h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted-background', role: 'progressbar', 'aria-label': '引导进度', 'aria-valuemin': 0, 'aria-valuemax': snapshot.value.total, 'aria-valuenow': snapshot.value.currentIndex + 1 }, [h('div', { class: 'h-full bg-primary transition-[width]', style: { width: `${progress}%` } })]),
      ])
    }
  },
})

export const TourPanel = defineComponent({
  props: { title: { type: String, required: true }, description: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h('div', { class: 'relative w-72 space-y-3' }, [
      h(TourControl, { action: 'close', 'aria-label': '关闭', class: 'absolute right-0 top-0 z-10 size-7 p-0' }, { default: () => h(CloseIcon, { class: 'size-4' }) }),
      h('div', { class: 'space-y-1 pr-8' }, [h('h3', { class: 'text-sm font-semibold' }, props.title), h('p', { class: 'text-sm leading-5 text-muted-foreground' }, props.description)]),
      h(TourProgress), slots.default?.(),
    ])
  },
})

export const DefaultTourActions = defineComponent({
  setup() {
    const { snapshot } = useTour()
    return () => h('div', { class: 'flex items-center justify-end gap-2' }, [
      h(TourControl, { action: 'skip', class: 'border-transparent bg-transparent' }, { default: () => '跳过' }),
      h(TourControl, { action: 'previous' }, { default: () => '上一步' }),
      h(TourControl, { action: snapshot.value.isLast ? 'complete' : 'next', class: '!border-primary !bg-primary !text-primary-foreground' }, { default: () => snapshot.value.isLast ? '完成' : '下一步' }),
    ])
  },
})

export const TourNavigation = defineComponent({
  setup() {
    const { snapshot } = useTour()
    return () => h('div', { class: 'flex justify-end gap-2' }, [
      h(TourControl, { action: 'previous' }, { default: () => '上一步' }),
      h(TourControl, { action: snapshot.value.isLast ? 'complete' : 'next' }, { default: () => snapshot.value.isLast ? '完成' : '下一步' }),
    ])
  },
})

export const TourIndicators = defineComponent({
  props: { count: { type: Number, required: true } },
  setup(props) {
    const { snapshot, goTo } = useTour()
    return () => h('div', { class: 'flex items-center gap-1', 'aria-label': '引导进度' }, Array.from({ length: props.count }, (_, index) => h('button', {
      key: index, type: 'button', 'aria-label': `第 ${index + 1} 步`,
      'aria-current': index === snapshot.value.currentIndex ? 'step' : undefined,
      class: `h-1.5 rounded-full transition-all ${index === snapshot.value.currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`,
      onClick: () => void goTo(index),
    })))
  },
})
