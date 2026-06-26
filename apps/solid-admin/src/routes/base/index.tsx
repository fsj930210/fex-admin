import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const Home = lazy(() => import('../../pages/Home').then((module) => ({ default: module.Home })))
const RouteTest = lazy(() =>
  import('../../pages/RouteTest').then((module) => ({ default: module.RouteTest })),
)

export const baseRoutes: AppRoute[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/route-test',
    component: RouteTest,
  },
]
