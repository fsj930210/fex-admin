import { createLazyRouteElement } from '../lazy'

export const baseRoutes = [
  {
    path: '/',
    element: createLazyRouteElement(() => import('../../pages/Home'), 'HomePage'),
  },
  {
    path: '/route-test',
    element: createLazyRouteElement(() => import('../../pages/RouteTest'), 'RouteTestPage'),
  },
]
