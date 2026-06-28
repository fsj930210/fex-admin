import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const ButtonPage = lazy(() =>
  import('../../pages/Button').then((module) => ({ default: module.ButtonPage })),
)
const CardPage = lazy(() =>
  import('../../pages/Card').then((module) => ({ default: module.CardPage })),
)

export const componentRoutes: AppRoute[] = [
  {
    path: '/button',
    component: ButtonPage,
  },
  {
    path: '/card',
    component: CardPage,
  },
]
