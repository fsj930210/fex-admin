import type { Routes } from '@angular/router'

export const componentRoutes: Routes = [
  { path: 'breadcrumb', loadComponent: () => import('../../pages/breadcrumb/index.component').then((module) => module.BreadcrumbComponent) },
  {
    path: 'auto-complete',
    loadComponent: () =>
      import('../../pages/auto-complete/index.component').then(
        (module) => module.AutoCompleteComponent,
      ),
  },
  {
    path: 'carousel',
    loadComponent: () =>
      import('../../pages/carousel/index.component').then((module) => module.CarouselComponent),
  },
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
    path: 'collapse',
    loadComponent: () =>
      import('../../pages/collapse/index.component').then((module) => module.CollapseComponent),
  },
  {
    path: 'context-menu',
    loadComponent: () =>
      import('../../pages/context-menu/index.component').then((module) => module.ContextMenuComponent),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('../../pages/dialog/index.component').then((module) => module.DialogComponent),
  },
  {
    path: 'drawer',
    loadComponent: () =>
      import('../../pages/drawer/index.component').then((module) => module.DrawerComponent),
  },
  {
    path: 'dropdown',
    loadComponent: () =>
      import('../../pages/dropdown/index.component').then((module) => module.DropdownComponent),
  },
  {
    path: 'data-table',
    loadComponent: () =>
      import('../../pages/data-table/index.component').then((module) => module.DataTableComponent),
  },
  {
    path: 'date-picker',
    loadComponent: () =>
      import('../../pages/date-picker/index.component').then(
        (module) => module.DatePickerComponent,
      ),
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
    path: 'mentions',
    loadComponent: () =>
      import('../../pages/mentions/index.component').then((module) => module.MentionsComponent),
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
    path: 'qrcode',
    loadComponent: () =>
      import('../../pages/qrcode/index.component').then((module) => module.QRCodeComponent),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('../../pages/tooltip/index.component').then((module) => module.TooltipComponent),
  },
  {
    path: 'tour',
    loadComponent: () =>
      import('../../pages/tour/index.component').then((module) => module.TourComponent),
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
    path: 'steps',
    loadComponent: () =>
      import('../../pages/steps/index.component').then((module) => module.StepsComponent),
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
    loadComponent: () =>
      import('../../pages/tabs/index.component').then((module) => module.TabsComponent),
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('../../pages/timeline/index.component').then((module) => module.TimelineComponent),
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
    path: 'theme-provider',
    loadComponent: () =>
      import('../../pages/theme-provider/index.component').then(
        (module) => module.ThemeProviderComponent,
      ),
  },
  {
    path: 'time-picker',
    loadComponent: () =>
      import('../../pages/time-picker/index.component').then(
        (module) => module.TimePickerComponent,
      ),
  },
  {
    path: 'transfer',
    loadComponent: () =>
      import('../../pages/transfer/index.component').then((module) => module.TransferComponent),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('../../pages/upload/index.component').then((module) => module.UploadComponent),
  },
  {
    path: 'watermark',
    loadComponent: () =>
      import('../../pages/watermark/index.component').then((module) => module.WatermarkComponent),
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('../../pages/tree/index.component').then((module) => module.TreeComponent),
  },
  {
    path: 'rate',
    loadComponent: () =>
      import('../../pages/rate/index.component').then((module) => module.RateComponent),
  },
  // eslint-disable-next-line unicorn/no-array-sort -- this literal is newly created and not shared.
].sort((left, right) => left.path.localeCompare(right.path))
