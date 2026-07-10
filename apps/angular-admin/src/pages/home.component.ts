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
    { to: '/button', label: 'Button' },
    { to: '/card', label: 'Card' },
    { to: '/checkbox', label: 'Checkbox' },
    { to: '/dialog', label: 'Dialog' },
    { to: '/alert', label: 'Alert' },
    { to: '/badge', label: 'Badge' },
    { to: '/empty', label: 'Empty' },
    { to: '/input', label: 'Input' },
    { to: '/kbd', label: 'Kbd' },
    { to: '/listbox', label: 'Listbox' },
    { to: '/menu', label: 'Menu' },
    { to: '/pagination', label: 'Pagination' },
    { to: '/popover', label: 'Popover' },
    { to: '/radio', label: 'Radio' },
    { to: '/spinner', label: 'Spinner' },
    { to: '/slider', label: 'Slider' },
    { to: '/switch', label: 'Switch' },
    { to: '/table', label: 'Table' },
    { to: '/toast', label: 'Toast' },
    { to: '/sortable', label: 'Sortable' },
    { to: '/interactions', label: 'Interactions' },
    { to: '/resizable', label: 'Resizable' },
    { to: '/textarea', label: 'Textarea' },
  ] as const
}
