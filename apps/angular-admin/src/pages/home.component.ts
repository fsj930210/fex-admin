import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'fex-home',
  imports: [RouterLink],
  host: { class: 'block' },
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly componentLinks = [
    { to: '/carousel', label: 'Carousel' },
    { to: '/button', label: 'Button' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/card', label: 'Card' },
    { to: '/checkbox', label: 'Checkbox' },
    { to: '/dialog', label: 'Dialog' },
    { to: '/data-grid', label: 'Data Grid' },
    { to: '/alert', label: 'Alert' },
    { to: '/badge', label: 'Badge' },
    { to: '/empty', label: 'Empty' },
    { to: '/form', label: 'Form' },
    { to: '/input', label: 'Input' },
    { to: '/kbd', label: 'Kbd' },
    { to: '/listbox', label: 'Listbox' },
    { to: '/menu', label: 'Menu' },
    { to: '/pagination', label: 'Pagination' },
    { to: '/popover', label: 'Popover' },
    { to: '/radio', label: 'Radio' },
    { to: '/spinner', label: 'Spinner' },
    { to: '/slider', label: 'Slider' },
    { to: '/scrollbar', label: 'Scrollbar' },
    { to: '/select', label: 'Select' },
    { to: '/switch', label: 'Switch' },
    { to: '/table', label: 'Table' },
    { to: '/tabs', label: 'Tabs' },
    { to: '/toast', label: 'Toast' },
    { to: '/sortable', label: 'Sortable' },
    { to: '/interactions', label: 'Interactions' },
    { to: '/resizable', label: 'Resizable' },
    { to: '/textarea', label: 'Textarea' },
    { to: '/tree', label: 'Tree' },
  ].sort((left, right) => left.label.localeCompare(right.label))
}
