import { createLazyRouteElement } from '../lazy'

export const componentRoutes = [
  {
    path: '/button',
    element: createLazyRouteElement(() => import('../../pages/Button'), 'ButtonPage'),
  },
  {
    path: '/card',
    element: createLazyRouteElement(() => import('../../pages/Card'), 'CardPage'),
  },
]
