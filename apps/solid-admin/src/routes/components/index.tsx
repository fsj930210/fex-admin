import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const ButtonPage = lazy(() =>
  import('../../pages/Button').then((module) => ({ default: module.ButtonPage })),
)
const CardPage = lazy(() =>
  import('../../pages/Card').then((module) => ({ default: module.CardPage })),
)
const AlertPage = lazy(() => import('../../pages/Alert').then((module) => ({ default: module.AlertPage })))
const BadgePage = lazy(() => import('../../pages/Badge').then((module) => ({ default: module.BadgePage })))
const EmptyPage = lazy(() => import('../../pages/Empty').then((module) => ({ default: module.EmptyPage })))
const InputPage = lazy(() => import('../../pages/Input').then((module) => ({ default: module.InputPage })))
const KbdPage = lazy(() => import('../../pages/Kbd').then((module) => ({ default: module.KbdPage })))
const PaginationPage = lazy(() =>
  import('../../pages/Pagination').then((module) => ({ default: module.PaginationPage })),
)
const SpinnerPage = lazy(() => import('../../pages/Spinner').then((module) => ({ default: module.SpinnerPage })))
const TablePage = lazy(() => import('../../pages/Table').then((module) => ({ default: module.TablePage })))
const TextareaPage = lazy(() =>
  import('../../pages/Textarea').then((module) => ({ default: module.TextareaPage })),
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
  {
    path: '/alert',
    component: AlertPage,
  },
  {
    path: '/badge',
    component: BadgePage,
  },
  {
    path: '/empty',
    component: EmptyPage,
  },
  {
    path: '/input',
    component: InputPage,
  },
  {
    path: '/kbd',
    component: KbdPage,
  },
  {
    path: '/pagination',
    component: PaginationPage,
  },
  {
    path: '/spinner',
    component: SpinnerPage,
  },
  {
    path: '/table',
    component: TablePage,
  },
  {
    path: '/textarea',
    component: TextareaPage,
  },
]
