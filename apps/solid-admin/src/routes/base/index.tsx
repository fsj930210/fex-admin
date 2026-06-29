import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const Home = lazy(() => import('../../pages/Home').then((module) => ({ default: module.Home })))

export const baseRoutes: AppRoute[] = [
  {
    path: '/',
    component: Home,
  },
]
