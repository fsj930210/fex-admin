import { createLazyRouteElement } from '../lazy'
import { ListboxPage } from '../../pages/Listbox'

export const componentRoutes = [
  {
    path: '/auto-complete',
    element: createLazyRouteElement(() => import('../../pages/AutoComplete'), 'AutoCompletePage'),
  },
  {
    path: '/carousel',
    element: createLazyRouteElement(() => import('../../pages/Carousel'), 'CarouselPage'),
  },
  {
    path: '/cascader',
    element: createLazyRouteElement(() => import('../../pages/Cascader'), 'CascaderPage'),
  },
  {
    path: '/data-table',
    element: createLazyRouteElement(() => import('../../pages/DataTable'), 'DataTablePage'),
  },
  {
    path: '/context-menu',
    element: createLazyRouteElement(() => import('../../pages/ContextMenu'), 'ContextMenuPage'),
  },
  {
    path: '/date-picker',
    element: createLazyRouteElement(() => import('../../pages/DatePicker'), 'DatePickerPage'),
  },
  {
    path: '/tree',
    element: createLazyRouteElement(() => import('../../pages/Tree'), 'TreePage'),
  },
  {
    path: '/tour',
    element: createLazyRouteElement(() => import('../../pages/Tour'), 'TourPage'),
  },
  {
    path: '/tooltip',
    element: createLazyRouteElement(() => import('../../pages/Tooltip'), 'TooltipPage'),
  },
  {
    path: '/transfer',
    element: createLazyRouteElement(() => import('../../pages/Transfer'), 'TransferPage'),
  },
  {
    path: '/upload',
    element: createLazyRouteElement(() => import('../../pages/Upload'), 'UploadPage'),
  },
  {
    path: '/watermark',
    element: createLazyRouteElement(() => import('../../pages/Watermark'), 'WatermarkPage'),
  },
  {
    path: '/breadcrumb',
    element: createLazyRouteElement(() => import('../../pages/Breadcrumb'), 'BreadcrumbPage'),
  },
  {
    path: '/button',
    element: createLazyRouteElement(() => import('../../pages/Button'), 'ButtonPage'),
  },
  {
    path: '/card',
    element: createLazyRouteElement(() => import('../../pages/Card'), 'CardPage'),
  },
  {
    path: '/calendar',
    element: createLazyRouteElement(() => import('../../pages/Calendar'), 'CalendarPage'),
  },
  {
    path: '/checkbox',
    element: createLazyRouteElement(() => import('../../pages/Checkbox'), 'CheckboxPage'),
  },
  {
    path: '/collapse',
    element: createLazyRouteElement(() => import('../../pages/Collapse'), 'CollapsePage'),
  },
  {
    path: '/dialog',
    element: createLazyRouteElement(() => import('../../pages/Dialog'), 'DialogPage'),
  },
  {
    path: '/drawer',
    element: createLazyRouteElement(() => import('../../pages/Drawer'), 'DrawerPage'),
  },
  {
    path: '/dropdown',
    element: createLazyRouteElement(() => import('../../pages/Dropdown'), 'DropdownPage'),
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
    path: '/input-number',
    element: createLazyRouteElement(() => import('../../pages/InputNumber'), 'InputNumberPage'),
  },
  {
    path: '/form',
    element: createLazyRouteElement(() => import('../../pages/Form'), 'FormPage'),
  },
  {
    path: '/kbd',
    element: createLazyRouteElement(() => import('../../pages/Kbd'), 'KbdPage'),
  },
  {
    path: '/listbox',
    element: <ListboxPage />,
  },
  {
    path: '/menu',
    element: createLazyRouteElement(() => import('../../pages/Menu'), 'MenuPage'),
  },
  {
    path: '/mentions',
    element: createLazyRouteElement(() => import('../../pages/Mentions'), 'MentionsPage'),
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
    path: '/radio',
    element: createLazyRouteElement(() => import('../../pages/Radio'), 'RadioPage'),
  },
  {
    path: '/qrcode',
    element: createLazyRouteElement(() => import('../../pages/QRCode'), 'QRCodePage'),
  },
  {
    path: '/rate',
    element: createLazyRouteElement(() => import('../../pages/Rate'), 'RatePage'),
  },
  {
    path: '/spinner',
    element: createLazyRouteElement(() => import('../../pages/Spinner'), 'SpinnerPage'),
  },
  {
    path: '/slider',
    element: createLazyRouteElement(() => import('../../pages/Slider'), 'SliderPage'),
  },
  {
    path: '/scrollbar',
    element: createLazyRouteElement(() => import('../../pages/Scrollbar'), 'ScrollbarPage'),
  },
  {
    path: '/select',
    element: createLazyRouteElement(() => import('../../pages/Select'), 'SelectPage'),
  },
  {
    path: '/steps',
    element: createLazyRouteElement(() => import('../../pages/Steps'), 'StepsPage'),
  },
  {
    path: '/switch',
    element: createLazyRouteElement(() => import('../../pages/Switch'), 'SwitchPage'),
  },
  {
    path: '/table',
    element: createLazyRouteElement(() => import('../../pages/Table'), 'TablePage'),
  },
  {
    path: '/tabs',
    element: createLazyRouteElement(() => import('../../pages/Tabs'), 'TabsPage'),
  },
  {
    path: '/timeline',
    element: createLazyRouteElement(() => import('../../pages/Timeline'), 'TimelinePage'),
  },
  {
    path: '/toast',
    element: createLazyRouteElement(() => import('../../pages/Toast'), 'ToastPage'),
  },
  {
    path: '/time-picker',
    element: createLazyRouteElement(() => import('../../pages/TimePicker'), 'TimePickerPage'),
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
  {
    path: '/theme-provider',
    element: createLazyRouteElement(() => import('../../pages/ThemeProvider'), 'ThemeProviderPage'),
  },
].sort((left, right) => left.path.localeCompare(right.path))
