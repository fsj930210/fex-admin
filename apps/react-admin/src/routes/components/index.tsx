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
  {
    path: '/alert',
    element: createLazyRouteElement(() => import('../../pages/Alert'), 'AlertPage'),
  },
  {
    path: '/badge',
    element: createLazyRouteElement(() => import('../../pages/Badge'), 'BadgePage'),
  },
  {
    path: '/empty',
    element: createLazyRouteElement(() => import('../../pages/Empty'), 'EmptyPage'),
  },
  {
    path: '/input',
    element: createLazyRouteElement(() => import('../../pages/Input'), 'InputPage'),
  },
  {
    path: '/kbd',
    element: createLazyRouteElement(() => import('../../pages/Kbd'), 'KbdPage'),
  },
  {
    path: '/pagination',
    element: createLazyRouteElement(() => import('../../pages/Pagination'), 'PaginationPage'),
  },
  {
    path: '/popover',
    element: createLazyRouteElement(() => import('../../pages/Popover'), 'PopoverPage'),
  },
  {
    path: '/spinner',
    element: createLazyRouteElement(() => import('../../pages/Spinner'), 'SpinnerPage'),
  },
  {
    path: '/table',
    element: createLazyRouteElement(() => import('../../pages/Table'), 'TablePage'),
  },
  {
    path: '/sortable',
    element: createLazyRouteElement(() => import('../../pages/Sortable'), 'SortablePage'),
  },
  {
    path: '/interactions',
    element: createLazyRouteElement(() => import('../../pages/Interactions'), 'InteractionsPage'),
  },
  {
    path: '/resizable',
    element: createLazyRouteElement(() => import('../../pages/Resizable'), 'ResizablePage'),
  },
  {
    path: '/textarea',
    element: createLazyRouteElement(() => import('../../pages/Textarea'), 'TextareaPage'),
  },
]
