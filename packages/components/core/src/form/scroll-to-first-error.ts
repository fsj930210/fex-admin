export interface ScrollToFirstErrorOptions extends ScrollIntoViewOptions {
  focus?: boolean
}

export type ScrollToFirstError = boolean | ScrollToFirstErrorOptions

const INVALID_CONTROL_SELECTOR = '[aria-invalid="true"]:not([disabled])'

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

export async function scrollToFirstError(
  container: ParentNode,
  option: ScrollToFirstError = true,
) {
  if (!option) return null

  // Framework adapters may commit touched/error state after handleSubmit resolves.
  await nextFrame(container)

  const control = container.querySelector<HTMLElement>(INVALID_CONTROL_SELECTOR)
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
