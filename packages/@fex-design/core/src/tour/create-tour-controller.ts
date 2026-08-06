import { createStore } from '../store/create-store'
import type {
  TourChangeInfo,
  TourController,
  TourOptions,
  TourRegisteredStep,
  TourSnapshot,
  TourStepOptions,
  TourTargetResolver,
} from './types'

function sameRect(left: DOMRect | null, right: DOMRect | null) {
  if (left === right) return true
  if (!left || !right) return false
  return left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height
}

export function createTourController<TData = unknown>(
  initialOptions: TourOptions<TData> = {},
): TourController<TData> {
  let options = initialOptions
  let uncontrolledOpen = initialOptions.defaultOpen ?? false
  let uncontrolledIndex = initialOptions.defaultCurrent ?? 0
  let order = 0
  let targetTimer: ReturnType<typeof setTimeout> | undefined
  let lastScrolledStep: string | null = null
  const steps = new Map<string, TourRegisteredStep<TData>>()
  const targets = new Map<string, TourTargetResolver>()
  const store = createStore<TourSnapshot<TData>>(createSnapshot())

  function getOpen() {
    return options.open ?? uncontrolledOpen
  }

  function getIndex() {
    return Math.max(0, options.current ?? uncontrolledIndex)
  }

  function sortedSteps() {
    const result = [...steps.values()]
    result.sort((left, right) => left.order - right.order)
    return result
  }

  function getCurrentStep() {
    return sortedSteps()[getIndex()] ?? null
  }

  function getTarget(step: TourRegisteredStep<TData> | null) {
    return step?.target ? targets.get(step.target)?.() ?? null : null
  }

  function createSnapshot(): TourSnapshot<TData> {
    const allSteps = sortedSteps()
    const currentStep = allSteps[getIndex()] ?? null
    const element = getTarget(currentStep)
    const total = allSteps.length
    const isOpen = Boolean(getOpen())
    return {
      open: isOpen,
      status: !isOpen ? 'idle' : currentStep?.target && !element ? 'waiting-target' : 'running',
      currentIndex: Math.min(getIndex(), Math.max(0, total - 1)),
      total,
      currentStep,
      targetKey: currentStep?.target ?? null,
      targetRect: element?.getBoundingClientRect() ?? null,
      targetAvailable: !currentStep?.target || Boolean(element),
      isFirst: getIndex() <= 0,
      isLast: total === 0 || getIndex() >= total - 1,
    }
  }

  function emit(nextSnapshot = createSnapshot()) {
    store.updateSnapshot((previousSnapshot) => {
      if (
        previousSnapshot.open === nextSnapshot.open &&
        previousSnapshot.status === nextSnapshot.status &&
        previousSnapshot.currentIndex === nextSnapshot.currentIndex &&
        previousSnapshot.total === nextSnapshot.total &&
        previousSnapshot.currentStep === nextSnapshot.currentStep &&
        previousSnapshot.targetKey === nextSnapshot.targetKey &&
        previousSnapshot.targetAvailable === nextSnapshot.targetAvailable &&
        sameRect(previousSnapshot.targetRect, nextSnapshot.targetRect)
      ) return previousSnapshot
      return nextSnapshot
    })
  }

  function clearTargetTimer() {
    if (targetTimer) clearTimeout(targetTimer)
    targetTimer = undefined
  }

  function info(reason: TourChangeInfo<TData>['reason']): TourChangeInfo<TData> {
    return { reason, step: getCurrentStep() ?? undefined }
  }

  function refreshTarget() {
    const snapshot = createSnapshot()
    emit(snapshot)
    clearTargetTimer()
    if (
      snapshot.open &&
      snapshot.targetAvailable &&
      snapshot.currentStep?.target &&
      snapshot.currentStep.name !== lastScrolledStep
    ) {
      const element = getTarget(snapshot.currentStep)
      const scrollOptions = snapshot.currentStep.scrollIntoViewOptions
      if (element && scrollOptions !== false) {
        element.scrollIntoView(scrollOptions === true ? { block: 'nearest', inline: 'nearest' } : scrollOptions)
      }
      lastScrolledStep = snapshot.currentStep.name
      emit(createSnapshot())
    }
    if (!snapshot.open || snapshot.targetAvailable || !snapshot.currentStep) return
    options.onTargetMissing?.(snapshot.currentStep)
    if (options.targetMissing === 'skip') {
      void next()
      return
    }
    targetTimer = setTimeout(() => {
      if (options.targetMissing === 'close') close('target-missing')
      else void next()
    }, options.targetTimeout ?? 3000)
  }

  function requestOpen(nextOpen: boolean, reason: TourChangeInfo<TData>['reason']) {
    if (options.open === undefined) uncontrolledOpen = nextOpen
    options.onOpenChange?.(nextOpen, info(reason))
    refreshTarget()
  }

  function requestIndex(index: number, reason: TourChangeInfo<TData>['reason']) {
    const total = sortedSteps().length
    const nextIndex = Math.min(Math.max(0, index), Math.max(0, total - 1))
    if (options.current === undefined) uncontrolledIndex = nextIndex
    options.onChange?.(nextIndex, info(reason))
    refreshTarget()
  }

  async function next() {
    const snapshot = createSnapshot()
    if (snapshot.isLast) {
      complete()
      return
    }
    requestIndex(snapshot.currentIndex + 1, 'next')
  }

  async function previous() {
    const snapshot = createSnapshot()
    if (!snapshot.isFirst) requestIndex(snapshot.currentIndex - 1, 'previous')
  }

  function close(reason: TourChangeInfo<TData>['reason'] = 'close') {
    if (options.open === undefined) uncontrolledOpen = false
    clearTargetTimer()
    lastScrolledStep = null
    options.onClose?.(info(reason))
    options.onOpenChange?.(false, info(reason))
    emit()
  }

  function complete() {
    if (options.open === undefined) uncontrolledOpen = false
    clearTargetTimer()
    lastScrolledStep = null
    options.onFinish?.()
    options.onClose?.(info('complete'))
    options.onOpenChange?.(false, info('complete'))
    emit({ ...createSnapshot(), open: false, status: 'completed' })
  }

  function setOptions(nextOptions: TourOptions<TData>) {
    options = nextOptions
    emit()
    refreshTarget()
  }

  function registerStep(step: TourStepOptions<TData>) {
    const record: TourRegisteredStep<TData> = { ...step, order: order++ }
    steps.set(step.name, record)
    refreshTarget()
    return () => {
      if (steps.get(step.name) === record) {
        steps.delete(step.name)
        refreshTarget()
      }
    }
  }

  function registerTarget(name: string, resolver: TourTargetResolver) {
    targets.set(name, resolver)
    refreshTarget()
    return () => {
      if (targets.get(name) === resolver) {
        targets.delete(name)
        refreshTarget()
      }
    }
  }

  function open() {
    requestOpen(true, 'open')
  }

  function goTo(index: number) {
    requestIndex(index, 'go-to')
    return Promise.resolve()
  }

  function destroy() {
    clearTargetTimer()
    steps.clear()
    targets.clear()
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions,
    registerStep,
    registerTarget,
    getTarget: (name) => targets.get(name)?.() ?? null,
    open,
    close,
    next,
    previous,
    goTo,
    skip: () => close('skip'),
    complete,
    refreshTarget,
    destroy,
  }
}
