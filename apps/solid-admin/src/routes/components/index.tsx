import { lazy } from 'solid-js'
import type { AppRoute } from '../types'

const AnchorPage = lazy(() => import('../../pages/Anchor').then((module) => ({ default: module.AnchorPage })))
const AspectRatioPage = lazy(() => import('../../pages/AspectRatio').then((module) => ({ default: module.AspectRatioPage })))
const AvatarPage = lazy(() => import('../../pages/Avatar').then((module) => ({ default: module.AvatarPage })))
const BubblePage = lazy(() => import('../../pages/Bubble').then((module) => ({ default: module.BubblePage })))
const MessagePage = lazy(() => import('../../pages/Message').then((module) => ({ default: module.MessagePage })))
const ProgressPage = lazy(() => import('../../pages/Progress').then((module) => ({ default: module.ProgressPage })))
const SeparatorPage = lazy(() => import('../../pages/Separator').then((module) => ({ default: module.SeparatorPage })))
const SkeletonPage = lazy(() => import('../../pages/Skeleton').then((module) => ({ default: module.SkeletonPage })))

const ButtonPage = lazy(() =>
  import('../../pages/Button').then((module) => ({ default: module.ButtonPage })),
)
const BreadcrumbPage = lazy(() =>
  import('../../pages/Breadcrumb').then((module) => ({ default: module.BreadcrumbPage })),
)
const AutoCompletePage = lazy(() =>
  import('../../pages/AutoComplete').then((module) => ({ default: module.AutoCompletePage })),
)
const CalendarPage = lazy(() =>
  import('../../pages/Calendar').then((module) => ({ default: module.CalendarPage })),
)
const CascaderPage = lazy(() =>
  import('../../pages/Cascader').then((module) => ({ default: module.CascaderPage })),
)
const CardPage = lazy(() =>
  import('../../pages/Card').then((module) => ({ default: module.CardPage })),
)
const CheckboxPage = lazy(() =>
  import('../../pages/Checkbox').then((module) => ({ default: module.CheckboxPage })),
)
const CollapsePage = lazy(() =>
  import('../../pages/Collapse').then((module) => ({ default: module.CollapsePage })),
)
const ColorPickerPage = lazy(() =>
  import('../../pages/ColorPicker').then((module) => ({ default: module.ColorPickerPage })),
)
const ContextMenuPage = lazy(() =>
  import('../../pages/ContextMenu').then((module) => ({ default: module.ContextMenuPage })),
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
const InputNumberPage = lazy(() =>
  import('../../pages/InputNumber').then((module) => ({ default: module.InputNumberPage })),
)
const InputOTPPage = lazy(() =>
  import('../../pages/InputOTP').then((module) => ({ default: module.InputOTPPage })),
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
const MasonryPage = lazy(() =>
  import('../../pages/Masonry').then((module) => ({ default: module.MasonryPage })),
)
const MentionsPage = lazy(() =>
  import('../../pages/Mentions').then((module) => ({ default: module.MentionsPage })),
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
const QRCodePage = lazy(() =>
  import('../../pages/QRCode').then((module) => ({ default: module.QRCodePage })),
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
const TagPage = lazy(() =>
  import('../../pages/Tag').then((module) => ({ default: module.TagPage })),
)
const TimelinePage = lazy(() =>
  import('../../pages/Timeline').then((module) => ({ default: module.TimelinePage })),
)
const ToastPage = lazy(() =>
  import('../../pages/Toast').then((module) => ({ default: module.ToastPage })),
)
const TogglePage = lazy(() =>
  import('../../pages/Toggle').then((module) => ({ default: module.TogglePage })),
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
const DataTablePage = lazy(() =>
  import('../../pages/DataTable').then((module) => ({ default: module.DataTablePage })),
)
const DatePickerPage = lazy(() =>
  import('../../pages/DatePicker').then((module) => ({ default: module.DatePickerPage })),
)
const TreePage = lazy(() =>
  import('../../pages/Tree').then((module) => ({ default: module.TreePage })),
)
const TreeSelectPage = lazy(() =>
  import('../../pages/TreeSelect').then((module) => ({ default: module.TreeSelectPage })),
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
const TourPage = lazy(() =>
  import('../../pages/Tour').then((module) => ({ default: module.TourPage })),
)
const WatermarkPage = lazy(() =>
  import('../../pages/Watermark').then((module) => ({ default: module.WatermarkPage })),
)
const ThemeProviderPage = lazy(() =>
  import('../../pages/ThemeProvider').then((module) => ({ default: module.ThemeProviderPage })),
)

export const componentRoutes: AppRoute[] = [
  { path: '/anchor', component: AnchorPage },
  { path: '/aspect-ratio', component: AspectRatioPage },
  { path: '/avatar', component: AvatarPage },
  { path: '/bubble', component: BubblePage },
  { path: '/breadcrumb', component: BreadcrumbPage },
  { path: '/message', component: MessagePage },
  { path: '/auto-complete', component: AutoCompletePage },
  { path: '/carousel', component: CarouselPage },
  {
    path: '/data-table',
    component: DataTablePage,
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
    path: '/cascader',
    component: CascaderPage,
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
    path: '/collapse',
    component: CollapsePage,
  },
  {
    path: '/color-picker',
    component: ColorPickerPage,
  },
  {
    path: '/context-menu',
    component: ContextMenuPage,
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
    path: '/input-number',
    component: InputNumberPage,
  },
  {
    path: '/input-otp',
    component: InputOTPPage,
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
    path: '/masonry',
    component: MasonryPage,
  },
  {
    path: '/mentions',
    component: MentionsPage,
  },
  {
    path: '/pagination',
    component: PaginationPage,
  },
  {
    path: '/popover',
    component: PopoverPage,
  },
  { path: '/progress', component: ProgressPage },
  { path: '/separator', component: SeparatorPage },
  { path: '/skeleton', component: SkeletonPage },
  {
    path: '/radio',
    component: RadioPage,
  },
  {
    path: '/qrcode',
    component: QRCodePage,
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
    path: '/tag',
    component: TagPage,
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
    path: '/toggle',
    component: TogglePage,
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
  { path: '/tour', component: TourPage },
  { path: '/watermark', component: WatermarkPage },
  { path: '/theme-provider', component: ThemeProviderPage },
  {
    path: '/tree',
    component: TreePage,
  },
  { path: '/tree-select', component: TreeSelectPage },
  { path: '/transfer', component: TransferPage },
  { path: '/upload', component: UploadPage },
  // eslint-disable-next-line unicorn/no-array-sort -- this literal is newly created and not shared.
].sort((left, right) => left.path.localeCompare(right.path))
