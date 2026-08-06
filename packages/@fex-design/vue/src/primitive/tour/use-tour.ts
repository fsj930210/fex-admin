import { useTourContext } from './context'

export function useTour() {
  const { controller, snapshot } = useTourContext('useTour')
  return {
    snapshot,
    open: controller.open,
    close: controller.close,
    next: controller.next,
    previous: controller.previous,
    goTo: controller.goTo,
    skip: controller.skip,
    complete: controller.complete,
  }
}
