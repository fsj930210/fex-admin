import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const ButtonPage = lazy(() =>
  import('../../pages/Button').then((module) => ({ default: module.ButtonPage })),
)

export const componentRoutes: AppRoute[] = [
  {
    path: '/button',
    component: ButtonPage,
  },
]
