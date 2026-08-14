import { Link } from 'react-router'

export function HomePage() {
  const componentLinks = [
    { to: '/anchor', label: 'Anchor' },
    { to: '/aspect-ratio', label: 'AspectRatio' },
    { to: '/avatar', label: 'Avatar' },
    { to: '/auto-complete', label: 'AutoComplete' },
    { to: '/alert', label: 'Alert' },
    { to: '/badge', label: 'Badge' },
    { to: '/breadcrumb', label: 'Breadcrumb' },
    { to: '/bubble', label: 'Bubble' },
    { to: '/button', label: 'Button' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/card', label: 'Card' },
    { to: '/checkbox', label: 'Checkbox' },
    { to: '/collapse', label: 'Collapse' },
    { to: '/color-picker', label: 'ColorPicker' },
    { to: '/carousel', label: 'Carousel' },
    { to: '/cascader', label: 'Cascader' },
    { to: '/context-menu', label: 'ContextMenu' },
    { to: '/data-table', label: 'Data Table' },
    { to: '/date-picker', label: 'DatePicker' },
    { to: '/dialog', label: 'Dialog' },
    { to: '/drawer', label: 'Drawer' },
    { to: '/dropdown', label: 'Dropdown' },
    { to: '/empty', label: 'Empty' },
    { to: '/form', label: 'Form' },
    { to: '/input', label: 'Input' },
    { to: '/input-number', label: 'InputNumber' },
    { to: '/input-otp', label: 'InputOTP' },
    { to: '/interactions', label: 'Interactions' },
    { to: '/kbd', label: 'Kbd' },
    { to: '/listbox', label: 'Listbox' },
    { to: '/menu', label: 'Menu' },
    { to: '/masonry', label: 'Masonry' },
    { to: '/message', label: 'Message' },
    { to: '/mentions', label: 'Mentions' },
    { to: '/pagination', label: 'Pagination' },
    { to: '/popover', label: 'Popover' },
    { to: '/progress', label: 'Progress' },
    { to: '/separator', label: 'Separator' },
    { to: '/skeleton', label: 'Skeleton' },
    { to: '/radio', label: 'Radio' },
    { to: '/qrcode', label: 'QRCode' },
    { to: '/rate', label: 'Rate' },
    { to: '/spinner', label: 'Spinner' },
    { to: '/slider', label: 'Slider' },
    { to: '/scrollbar', label: 'Scrollbar' },
    { to: '/switch', label: 'Switch' },
    { to: '/table', label: 'Table' },
    { to: '/tabs', label: 'Tabs' },
    { to: '/tag', label: 'Tag' },
    { to: '/steps', label: 'Steps' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/toggle', label: 'Toggle' },
    { to: '/tree', label: 'Tree' },
    { to: '/tree-select', label: 'TreeSelect' },
    { to: '/transfer', label: 'Transfer' },
    { to: '/upload', label: 'Upload' },
    { to: '/toast', label: 'Toast' },
    { to: '/sortable', label: 'Sortable' },
    { to: '/resizable', label: 'Resizable' },
    { to: '/select', label: 'Select' },
    { to: '/textarea', label: 'Textarea' },
    { to: '/theme-provider', label: 'ThemeProvider' },
    { to: '/time-picker', label: 'TimePicker' },
    { to: '/tooltip', label: 'Tooltip' },
    { to: '/tour', label: 'Tour' },
    { to: '/watermark', label: 'Watermark' },
  ].sort((left, right) => left.label.localeCompare(right.label))

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-sm">
          <h1 className="text-2xl font-semibold text-foreground">React Admin</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            临时导航入口，后续后台功能完整后再调整首页结构。
          </p>
        </header>

        <section className="space-y-space-md">
          <h2 className="text-base font-medium text-foreground">Components</h2>
          <nav
            className="grid grid-cols-1 gap-space-sm sm:grid-cols-2 lg:grid-cols-3"
            aria-label="组件示例"
          >
            {componentLinks.map((link) => (
              <Link
                key={link.to}
                className="rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-muted-background"
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  )
}
