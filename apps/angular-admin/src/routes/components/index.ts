import type { Routes } from '@angular/router'

export const componentRoutes: Routes = [
  {
    path: 'button',
    loadComponent: () =>
      import('../../pages/button/index.component').then((module) => module.ButtonComponent),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('../../pages/card/index.component').then((module) => module.CardComponent),
  },
  {
    path: 'alert',
    loadComponent: () => import('../../pages/alert/index.component').then((module) => module.AlertComponent),
  },
  {
    path: 'badge',
    loadComponent: () => import('../../pages/badge/index.component').then((module) => module.BadgeComponent),
  },
  {
    path: 'empty',
    loadComponent: () => import('../../pages/empty/index.component').then((module) => module.EmptyComponent),
  },
  {
    path: 'input',
    loadComponent: () => import('../../pages/input/index.component').then((module) => module.InputComponent),
  },
  {
    path: 'kbd',
    loadComponent: () => import('../../pages/kbd/index.component').then((module) => module.KbdComponent),
  },
  {
    path: 'listbox',
    loadComponent: () =>
      import('../../pages/listbox/index.component').then((module) => module.ListboxComponent),
  },
  {
    path: 'menu',
    loadComponent: () => import('../../pages/menu/index.component').then((module) => module.MenuComponent),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('../../pages/pagination/index.component').then((module) => module.PaginationComponent),
  },
  {
    path: 'popover',
    loadComponent: () =>
      import('../../pages/popover/index.component').then((module) => module.PopoverComponent),
  },
  {
    path: 'spinner',
    loadComponent: () =>
      import('../../pages/spinner/index.component').then((module) => module.SpinnerComponent),
  },
  {
    path: 'table',
    loadComponent: () => import('../../pages/table/index.component').then((module) => module.TableComponent),
  },
  {
    path: 'sortable',
    loadComponent: () =>
      import('../../pages/sortable/index.component').then((module) => module.SortableComponent),
  },
  {
    path: 'interactions',
    loadComponent: () =>
      import('../../pages/interactions/index.component').then((module) => module.InteractionsComponent),
  },
  {
    path: 'resizable',
    loadComponent: () =>
      import('../../pages/resizable/index.component').then((module) => module.ResizableComponent),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('../../pages/textarea/index.component').then((module) => module.TextareaComponent),
  },
]
