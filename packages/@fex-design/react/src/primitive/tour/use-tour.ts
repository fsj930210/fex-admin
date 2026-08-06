import { useTourContext } from './tour-context'

export function useTour() {
  const context = useTourContext('useTour')
  return {
    ...context,
    open: context.controller.open,
    close: context.controller.close,
    next: context.controller.next,
    previous: context.controller.previous,
    goTo: context.controller.goTo,
    skip: context.controller.skip,
    complete: context.controller.complete,
  }
}
