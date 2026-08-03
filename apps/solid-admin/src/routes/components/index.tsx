import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const ButtonPage = lazy(() =>
  import('../../pages/Button').then((module) => ({ default: module.ButtonPage })),
)
const AutoCompletePage = lazy(() =>
  import('../../pages/AutoComplete').then((module) => ({ default: module.AutoCompletePage })),
)
const CalendarPage = lazy(() =>
  import('../../pages/Calendar').then((module) => ({ default: module.CalendarPage })),
)
const CardPage = lazy(() =>
  import('../../pages/Card').then((module) => ({ default: module.CardPage })),
)
const CheckboxPage = lazy(() =>
  import('../../pages/Checkbox').then((module) => ({ default: module.CheckboxPage })),
)
const DialogPage = lazy(() =>
  import('../../pages/Dialog').then((module) => ({ default: module.DialogPage })),
)
const DrawerPage = lazy(() =>
  import('../../pages/Drawer').then((module) => ({ default: module.DrawerPage })),
)
const DropdownPage = lazy(() =>
  import('../../pages/Dropdown').then((module) => ({ default: module.DropdownPage })),
)
const AlertPage = lazy(() =>
  import('../../pages/Alert').then((module) => ({ default: module.AlertPage })),
)
const BadgePage = lazy(() =>
  import('../../pages/Badge').then((module) => ({ default: module.BadgePage })),
)
const EmptyPage = lazy(() =>
  import('../../pages/Empty').then((module) => ({ default: module.EmptyPage })),
)
const InputPage = lazy(() =>
  import('../../pages/Input').then((module) => ({ default: module.InputPage })),
)
const FormPage = lazy(() =>
  import('../../pages/Form').then((module) => ({ default: module.FormPage })),
)
const TransferPage = lazy(() =>
  import('../../pages/Transfer').then((module) => ({ default: module.TransferPage })),
)
const KbdPage = lazy(() =>
  import('../../pages/Kbd').then((module) => ({ default: module.KbdPage })),
)
const ListboxPage = lazy(() =>
  import('../../pages/Listbox').then((module) => ({ default: module.ListboxPage })),
)
const MenuPage = lazy(() =>
  import('../../pages/Menu').then((module) => ({ default: module.MenuPage })),
)
const PaginationPage = lazy(() =>
  import('../../pages/Pagination').then((module) => ({ default: module.PaginationPage })),
)
const PopoverPage = lazy(() =>
  import('../../pages/Popover').then((module) => ({ default: module.PopoverPage })),
)
const RadioPage = lazy(() =>
  import('../../pages/Radio').then((module) => ({ default: module.RadioPage })),
)
const RatePage = lazy(() =>
  import('../../pages/Rate').then((module) => ({ default: module.RatePage })),
)
const SpinnerPage = lazy(() =>
  import('../../pages/Spinner').then((module) => ({ default: module.SpinnerPage })),
)
const SliderPage = lazy(() =>
  import('../../pages/Slider').then((module) => ({ default: module.SliderPage })),
)
const ScrollbarPage = lazy(() =>
  import('../../pages/Scrollbar').then((module) => ({ default: module.ScrollbarPage })),
)
const SelectPage = lazy(() =>
  import('../../pages/Select').then((module) => ({ default: module.SelectPage })),
)
const StepsPage = lazy(() =>
  import('../../pages/Steps').then((module) => ({ default: module.StepsPage })),
)
const SwitchPage = lazy(() =>
  import('../../pages/Switch').then((module) => ({ default: module.SwitchPage })),
)
const TablePage = lazy(() =>
  import('../../pages/Table').then((module) => ({ default: module.TablePage })),
)
const TabsPage = lazy(() =>
  import('../../pages/Tabs').then((module) => ({ default: module.TabsPage })),
)
const TimelinePage = lazy(() =>
  import('../../pages/Timeline').then((module) => ({ default: module.TimelinePage })),
)
const ToastPage = lazy(() =>
  import('../../pages/Toast').then((module) => ({ default: module.ToastPage })),
)
const SortablePage = lazy(() =>
  import('../../pages/Sortable').then((module) => ({ default: module.SortablePage })),
)
const InteractionsPage = lazy(() =>
  import('../../pages/Interactions').then((module) => ({ default: module.InteractionsPage })),
)
const ResizablePage = lazy(() =>
  import('../../pages/Resizable').then((module) => ({ default: module.ResizablePage })),
)
const TextareaPage = lazy(() =>
  import('../../pages/Textarea').then((module) => ({ default: module.TextareaPage })),
)
const TimePickerPage = lazy(() =>
  import('../../pages/TimePicker').then((module) => ({ default: module.TimePickerPage })),
)
const DataGridPage = lazy(() =>
  import('../../pages/DataGrid').then((module) => ({ default: module.DataGridPage })),
)
const DatePickerPage = lazy(() =>
  import('../../pages/DatePicker').then((module) => ({ default: module.DatePickerPage })),
)
const TreePage = lazy(() =>
  import('../../pages/Tree').then((module) => ({ default: module.TreePage })),
)
const CarouselPage = lazy(() =>
  import('../../pages/Carousel').then((module) => ({ default: module.CarouselPage })),
)
const UploadPage = lazy(() =>
  import('../../pages/Upload').then((module) => ({ default: module.UploadPage })),
)
const TooltipPage = lazy(() =>
  import('../../pages/Tooltip').then((module) => ({ default: module.TooltipPage })),
)

export const componentRoutes: AppRoute[] = [
  { path: '/auto-complete', component: AutoCompletePage },
  { path: '/carousel', component: CarouselPage },
  {
    path: '/data-grid',
    component: DataGridPage,
  },
  {
    path: '/date-picker',
    component: DatePickerPage,
  },
  {
    path: '/button',
    component: ButtonPage,
  },
  {
    path: '/calendar',
    component: CalendarPage,
  },
  {
    path: '/card',
    component: CardPage,
  },
  {
    path: '/checkbox',
    component: CheckboxPage,
  },
  {
    path: '/dialog',
    component: DialogPage,
  },
  {
    path: '/drawer',
    component: DrawerPage,
  },
  {
    path: '/dropdown',
    component: DropdownPage,
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
    path: '/form',
    component: FormPage,
  },
  {
    path: '/kbd',
    component: KbdPage,
  },
  {
    path: '/listbox',
    component: ListboxPage,
  },
  {
    path: '/menu',
    component: MenuPage,
  },
  {
    path: '/pagination',
    component: PaginationPage,
  },
  {
    path: '/popover',
    component: PopoverPage,
  },
  {
    path: '/radio',
    component: RadioPage,
  },
  {
    path: '/rate',
    component: RatePage,
  },
  {
    path: '/spinner',
    component: SpinnerPage,
  },
  {
    path: '/slider',
    component: SliderPage,
  },
  {
    path: '/scrollbar',
    component: ScrollbarPage,
  },
  {
    path: '/select',
    component: SelectPage,
  },
  {
    path: '/steps',
    component: StepsPage,
  },
  {
    path: '/switch',
    component: SwitchPage,
  },
  {
    path: '/table',
    component: TablePage,
  },
  {
    path: '/tabs',
    component: TabsPage,
  },
  {
    path: '/timeline',
    component: TimelinePage,
  },
  {
    path: '/toast',
    component: ToastPage,
  },
  {
    path: '/sortable',
    component: SortablePage,
  },
  {
    path: '/interactions',
    component: InteractionsPage,
  },
  {
    path: '/resizable',
    component: ResizablePage,
  },
  {
    path: '/textarea',
    component: TextareaPage,
  },
  { path: '/time-picker', component: TimePickerPage },
  { path: '/tooltip', component: TooltipPage },
  {
    path: '/tree',
    component: TreePage,
  },
  { path: '/transfer', component: TransferPage },
  { path: '/upload', component: UploadPage },
  // eslint-disable-next-line unicorn/no-array-sort -- this literal is newly created and not shared.
].sort((left, right) => left.path.localeCompare(right.path))
