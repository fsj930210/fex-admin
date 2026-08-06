export { TourRoot, type TourRootProps } from './tour-root'
export { TourStep, type TourStepProps } from './tour-step'
export { TourTarget, type TourTargetProps, type TourTargetRenderProps } from './tour-target'
export { TourPortal, type TourPortalProps } from './tour-portal'
export { TourOverlay, type TourOverlayProps, type TourOverlayRenderProps } from './tour-overlay'
export { TourContent, type TourContentProps, type TourContentRenderProps } from './tour-content'
export { TourArrow, type TourArrowProps } from './tour-arrow'
export { TourControl, type TourAction, type TourControlProps } from './tour-control'
export { useTour } from './use-tour'

import { TourRoot } from './tour-root'
import { TourStep } from './tour-step'
import { TourTarget } from './tour-target'
import { TourPortal } from './tour-portal'
import { TourOverlay } from './tour-overlay'
import { TourContent } from './tour-content'
import { TourArrow } from './tour-arrow'
import { TourControl } from './tour-control'

export const Tour = {
  Root: TourRoot,
  Step: TourStep,
  Target: TourTarget,
  Portal: TourPortal,
  Overlay: TourOverlay,
  Content: TourContent,
  Arrow: TourArrow,
  Control: TourControl,
}
