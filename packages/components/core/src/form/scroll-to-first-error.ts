export interface ScrollToFirstErrorOptions extends ScrollIntoViewOptions {
  focus?: boolean
}

export type ScrollToFirstError = boolean | ScrollToFirstErrorOptions

const INVALID_CONTROL_SELECTOR = '[aria-invalid="true"]:not([disabled])'
const FIELD_CONTROL_SELECTOR = 'input, select, textarea, button, [tabindex]'

function nextFrame(container: ParentNode) {
  return new Promise<void>((resolve) => {
    const view = container instanceof Document
      ? container.defaultView
      : container.ownerDocument?.defaultView

    if (!view) {
      resolve()
      return
    }

    view.requestAnimationFrame(() => resolve())
  })
}

export async function scrollToField(
  container: ParentNode,
  fieldName?: string,
  option: ScrollToFirstError = true,
) {
  if (!option) return null

  let control: HTMLElement | null = null
  for (let frame = 0; frame < 6; frame += 1) {
    // Framework adapters may commit touched/error state after handleSubmit resolves.
    await nextFrame(container)
    const candidates = fieldName === undefined
      ? Array.from(container.querySelectorAll<HTMLElement>(INVALID_CONTROL_SELECTOR))
      : Array.from(container.querySelectorAll<HTMLElement>('[data-field-name]'))
        .filter((element) => element.dataset.fieldName === fieldName)

    control = candidates.find((element) => element.matches(FIELD_CONTROL_SELECTOR) && !element.hasAttribute('disabled'))
      ?? candidates.find((element) => !element.hasAttribute('disabled'))
      ?? null
    if (control || fieldName !== undefined) break
  }

  if (!control) return null

  const { focus = true, ...scrollOptions } = typeof option === 'boolean' ? {} : option

  if (focus && typeof control.focus === 'function') {
    control.focus({ preventScroll: true })
  }

  control.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
    ...scrollOptions,
  })

  return control
}

export function scrollToFirstError(
  container: ParentNode,
  option: ScrollToFirstError = true,
) {
  return scrollToField(container, undefined, option)
}
