export type MenuOrientation = 'horizontal' | 'vertical'

const listSelector = '[data-slot="menu-list"]'
const itemSelector = '[data-slot="menu-item"]'

function isHTMLElement(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement
}

export function getMenuListItems(list: HTMLElement) {
  return Array.from(list.querySelectorAll<HTMLElement>(itemSelector)).filter(
    (item) =>
      item.closest(listSelector) === list &&
      item.getAttribute('aria-disabled') !== 'true' &&
      !item.hasAttribute('disabled'),
  )
}

export function syncMenuListTabStops(list: HTMLElement) {
  const items = getMenuListItems(list)
  if (!items.length) return
  const active = items.find((item) => item.tabIndex === 0 && !item.hidden) ?? items[0]
  items.forEach((item) => {
    item.tabIndex = item === active ? 0 : -1
  })
}

export function focusMenuItem(item: HTMLElement | undefined) {
  if (!item) return
  const list = item.closest<HTMLElement>(listSelector)
  if (list) {
    getMenuListItems(list).forEach((candidate) => {
      candidate.tabIndex = candidate === item ? 0 : -1
    })
  }
  item.focus()
}

function moveFocus(list: HTMLElement, current: HTMLElement, offset: number) {
  const items = getMenuListItems(list)
  const currentIndex = items.indexOf(current)
  if (currentIndex < 0 || !items.length) return false
  const nextIndex = (currentIndex + offset + items.length) % items.length
  focusMenuItem(items[nextIndex])
  return true
}

function findChildList(item: HTMLElement) {
  const value = item.dataset.menuValue
  if (!value) return undefined
  return Array.from(document.querySelectorAll<HTMLElement>(listSelector)).find(
    (list) => list.dataset.parentValue === value && list.offsetParent !== null,
  )
}

function openSubmenu(item: HTMLElement) {
  if (item.getAttribute('aria-haspopup') !== 'menu') return false
  if (item.getAttribute('aria-expanded') !== 'true') item.click()
  requestAnimationFrame(() => {
    const childList = findChildList(item)
    if (childList) focusMenuItem(getMenuListItems(childList)[0])
  })
  return true
}

function closeSubmenu(list: HTMLElement) {
  const parentValue = list.dataset.parentValue
  if (!parentValue) return false
  const parentItem = document.querySelector<HTMLElement>(
    `${itemSelector}[data-menu-value="${CSS.escape(parentValue)}"]`,
  )
  if (!parentItem) return false
  if (parentItem.getAttribute('aria-expanded') === 'true') parentItem.click()
  focusMenuItem(parentItem)
  return true
}

export function handleMenuListFocus(event: FocusEvent) {
  const item = isHTMLElement(event.target) ? event.target.closest<HTMLElement>(itemSelector) : null
  if (item) focusMenuItem(item)
}

export function handleMenuListKeyDown(
  event: KeyboardEvent,
  list: HTMLElement,
  orientation: MenuOrientation,
) {
  const item = isHTMLElement(event.target) ? event.target.closest<HTMLElement>(itemSelector) : null
  if (!item || item.closest(listSelector) !== list) return

  let handled = false
  if (event.key === 'Home') {
    focusMenuItem(getMenuListItems(list)[0])
    handled = true
  } else if (event.key === 'End') {
    focusMenuItem(getMenuListItems(list).at(-1))
    handled = true
  } else if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
    handled = moveFocus(list, item, -1)
  } else if (orientation === 'horizontal' && event.key === 'ArrowRight') {
    handled = moveFocus(list, item, 1)
  } else if (orientation === 'horizontal' && event.key === 'ArrowDown') {
    handled = openSubmenu(item)
  } else if (orientation === 'vertical' && event.key === 'ArrowUp') {
    handled = moveFocus(list, item, -1)
  } else if (orientation === 'vertical' && event.key === 'ArrowDown') {
    handled = moveFocus(list, item, 1)
  } else if (orientation === 'vertical' && event.key === 'ArrowRight') {
    handled = openSubmenu(item)
  } else if (orientation === 'vertical' && (event.key === 'ArrowLeft' || event.key === 'Escape')) {
    handled = closeSubmenu(list)
  }

  if (handled) {
    event.preventDefault()
    event.stopPropagation()
  }
}
