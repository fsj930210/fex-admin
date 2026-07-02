import type { DisclosureChangeInfo } from '../../disclosure/create-disclosure'
import type { OverlayEventInfo } from '../types'

export type OverlayTrigger = 'click' | 'hover' | 'focus' | 'context-menu'

export interface TriggerOptions {
  trigger?: OverlayTrigger[] | undefined
  allowedTriggers?: OverlayTrigger[] | undefined
  hoverOpenDelay?: number | undefined
  hoverCloseDelay?: number | undefined
  disabled?: boolean | undefined
  onOpenChangeRequest: (open: boolean, info: DisclosureChangeInfo) => void
}

export interface TriggerBehavior {
  setOptions: (options: TriggerOptions) => void
  getTriggers: () => OverlayTrigger[]
  clear: (info?: Partial<DisclosureChangeInfo>, shouldRequest?: boolean) => void
  trigger: {
    click: (event: OverlayEventInfo) => void
    pointerEnter: (event: OverlayEventInfo) => void
    pointerLeave: (event: OverlayEventInfo) => void
    focus: (event: OverlayEventInfo) => void
    blur: (event: OverlayEventInfo) => void
    contextMenu: (event: OverlayEventInfo) => void
  }
  content: {
    pointerEnter: (event: OverlayEventInfo) => void
    pointerLeave: (event: OverlayEventInfo) => void
  }
  destroy: () => void
}

const defaultAllowedTriggers: OverlayTrigger[] = ['click', 'hover', 'focus', 'context-menu']

export function normalizeTriggers(
  trigger: OverlayTrigger[] | undefined,
  allowedTriggers: OverlayTrigger[] = defaultAllowedTriggers,
) {
  // 默认 trigger 是 click；allowedTriggers 用来限制某类组件能暴露哪些触发方式。
  // 例如 Tooltip 可以允许 hover/focus，ContextMenu 可以只允许 context-menu。
  const typedTriggers: OverlayTrigger[] = trigger ? Array.from(trigger) : ['click']
  const allowed = new Set(allowedTriggers)
  // 这里顺便去重，避免传入 ['hover', 'hover'] 时 openSources 语义和 getTriggers 展示不一致。
  return typedTriggers.filter(
    (item, index) => allowed.has(item) && typedTriggers.indexOf(item) === index,
  )
}

function isSameTriggers(left: OverlayTrigger[], right: OverlayTrigger[]) {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

export function createTrigger(options: TriggerOptions): TriggerBehavior {
  let currentOptions = options
  let triggers = normalizeTriggers(options.trigger, options.allowedTriggers)
  // 一个浮层可以同时由多个来源保持打开，例如 hover + focus。
  // 只有所有来源都移除后才请求关闭，避免鼠标移出但焦点仍在 trigger 上时面板闪关。
  const openSources = new Set<OverlayTrigger>()
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let pointerInsideContent = false

  function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
    if (timer) {
      clearTimeout(timer)
    }
  }

  function hasTrigger(trigger: OverlayTrigger) {
    return !currentOptions.disabled && triggers.includes(trigger)
  }

  function request(info: DisclosureChangeInfo) {
    // trigger 不直接改 open，只根据 openSources 计算“是否应该打开”，交给 disclosure 处理受控/非受控。
    // 这样 trigger 不需要知道当前组件是不是受控模式。
    currentOptions.onOpenChangeRequest(openSources.size > 0, info)
  }

  function addSource(source: OverlayTrigger, event: OverlayEventInfo) {
    openSources.add(source)
    request({ reason: `trigger-${source}` as DisclosureChangeInfo['reason'], event: event.event })
  }

  function removeSource(source: OverlayTrigger, event: OverlayEventInfo) {
    openSources.delete(source)
    request({ reason: `trigger-${source}` as DisclosureChangeInfo['reason'], event: event.event })
  }

  function scheduleHoverOpen(event: OverlayEventInfo) {
    // 进入 trigger 时取消关闭定时器，处理“从 content 快速回到 trigger”的场景。
    // 如果不取消，会出现鼠标明明还在交互区域内，延迟关闭仍然执行的问题。
    clearTimer(closeTimer)
    clearTimer(openTimer)
    const delay = currentOptions.hoverOpenDelay ?? 0
    if (delay > 0) {
      openTimer = setTimeout(() => addSource('hover', event), delay)
      return
    }
    addSource('hover', event)
  }

  function scheduleHoverClose(event: OverlayEventInfo) {
    // hover close 延迟同时服务 trigger 和 content。
    // pointerInsideContent 为 true 时不关闭，保证鼠标从 trigger 移到 content 的过程中面板稳定。
    clearTimer(openTimer)
    clearTimer(closeTimer)
    const delay = currentOptions.hoverCloseDelay ?? 0
    closeTimer = setTimeout(() => {
      if (!pointerInsideContent) {
        removeSource('hover', event)
      }
    }, delay)
  }

  return {
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      const nextTriggers = normalizeTriggers(nextOptions.trigger, nextOptions.allowedTriggers)
      if (!isSameTriggers(triggers, nextTriggers)) {
        // 只在触发方式语义变化时替换数组，保持组合 snapshot 中 trigger 字段尽量稳定。
        triggers = nextTriggers
      }
    },
    getTriggers: () => triggers,
    clear: (info, shouldRequest = true) => {
      // 外部 dismiss 会先清空 trigger 来源，再关闭 overlay。
      // shouldRequest=false 用于“已经由 overlay.close 负责通知”的场景，避免重复触发 onOpenChange。
      openSources.clear()
      if (!shouldRequest) {
        return
      }
      currentOptions.onOpenChangeRequest(false, {
        reason: info?.reason ?? 'manual',
        event: info?.event,
        source: info?.source,
      })
    },
    trigger: {
      click: (event) => {
        if (!hasTrigger('click')) {
          return
        }
        if (openSources.has('click')) {
          removeSource('click', event)
        } else {
          addSource('click', event)
        }
      },
      pointerEnter: (event) => {
        if (hasTrigger('hover')) {
          scheduleHoverOpen(event)
        }
      },
      pointerLeave: (event) => {
        if (hasTrigger('hover')) {
          scheduleHoverClose(event)
        }
      },
      focus: (event) => {
        if (hasTrigger('focus')) {
          addSource('focus', event)
        }
      },
      blur: (event) => {
        if (hasTrigger('focus')) {
          removeSource('focus', event)
        }
      },
      contextMenu: (event) => {
        if (!hasTrigger('context-menu')) {
          return
        }
        // contextmenu 触发需要阻止浏览器原生菜单，否则自定义菜单和系统菜单会同时出现。
        event.preventDefault?.()
        // 右键菜单是一次性触发来源，打开前清空其它来源，避免 hover/focus 残留让菜单无法关闭。
        openSources.clear()
        addSource('context-menu', event)
      },
    },
    content: {
      pointerEnter: () => {
        pointerInsideContent = true
        clearTimer(closeTimer)
      },
      pointerLeave: (event) => {
        pointerInsideContent = false
        if (hasTrigger('hover')) {
          scheduleHoverClose(event)
        }
      },
    },
    destroy: () => {
      clearTimer(openTimer)
      clearTimer(closeTimer)
      openSources.clear()
    },
  }
}
