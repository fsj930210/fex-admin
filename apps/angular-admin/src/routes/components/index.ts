import type { Routes } from '@angular/router'

export const componentRoutes: Routes = [
  { path: 'carousel', loadComponent: () => import('../../pages/carousel/index.component').then((module) => module.CarouselComponent) },
  {
    path: 'button',
    loadComponent: () =>
      import('../../pages/button/index.component').then((module) => module.ButtonComponent),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('../../pages/calendar/index.component').then((module) => module.CalendarComponent),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('../../pages/card/index.component').then((module) => module.CardComponent),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('../../pages/checkbox/index.component').then((module) => module.CheckboxComponent),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('../../pages/dialog/index.component').then((module) => module.DialogComponent),
  },
  {
    path: 'data-grid',
    loadComponent: () =>
      import('../../pages/data-grid/index.component').then((module) => module.DataGridComponent),
  },
  {
    path: 'alert',
    loadComponent: () =>
      import('../../pages/alert/index.component').then((module) => module.AlertComponent),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('../../pages/badge/index.component').then((module) => module.BadgeComponent),
  },
  {
    path: 'empty',
    loadComponent: () =>
      import('../../pages/empty/index.component').then((module) => module.EmptyComponent),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('../../pages/input/index.component').then((module) => module.InputComponent),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('../../pages/form/index.component').then((module) => module.FormComponent),
  },
  {
    path: 'kbd',
    loadComponent: () =>
      import('../../pages/kbd/index.component').then((module) => module.KbdComponent),
  },
  {
    path: 'listbox',
    loadComponent: () =>
      import('../../pages/listbox/index.component').then((module) => module.ListboxComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('../../pages/menu/index.component').then((module) => module.MenuComponent),
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
    path: 'radio',
    loadComponent: () =>
      import('../../pages/radio/index.component').then((module) => module.RadioComponent),
  },
  {
    path: 'spinner',
    loadComponent: () =>
      import('../../pages/spinner/index.component').then((module) => module.SpinnerComponent),
  },
  {
    path: 'slider',
    loadComponent: () =>
      import('../../pages/slider/index.component').then((module) => module.SliderComponent),
  },
  {
    path: 'scrollbar',
    loadComponent: () =>
      import('../../pages/scrollbar/index.component').then((module) => module.ScrollbarComponent),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('../../pages/select/index.component').then((module) => module.SelectComponent),
  },
  {
    path: 'switch',
    loadComponent: () =>
      import('../../pages/switch/index.component').then((module) => module.SwitchComponent),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('../../pages/table/index.component').then((module) => module.TableComponent),
  },
  {
    path: 'tabs',
    loadComponent: () => import('../../pages/tabs/index.component').then((module) => module.TabsComponent),
  },
  {
    path: 'toast',
    loadComponent: () =>
      import('../../pages/toast/index.component').then((module) => module.ToastComponent),
  },
  {
    path: 'sortable',
    loadComponent: () =>
      import('../../pages/sortable/index.component').then((module) => module.SortableComponent),
  },
  {
    path: 'interactions',
    loadComponent: () =>
      import('../../pages/interactions/index.component').then(
        (module) => module.InteractionsComponent,
      ),
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
  {
    path: 'tree',
    loadComponent: () =>
      import('../../pages/tree/index.component').then((module) => module.TreeComponent),
  },
].sort((left, right) => left.path.localeCompare(right.path))
