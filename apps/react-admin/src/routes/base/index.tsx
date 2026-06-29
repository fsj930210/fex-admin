import { createLazyRouteElement } from '../lazy'

export const baseRoutes = [
  {
    path: '/',
    element: createLazyRouteElement(() => import('../../pages/Home'), 'HomePage'),
  },
]
