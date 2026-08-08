import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { MenuDivider, MenuGroup, MenuGroupLabel, MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import Card from '@fex-design/angular/ui/card'
import { rootClassName, verticalItemClassName, verticalListClassName } from './demo-styles'

@Component({
  selector: 'app-menu-restored-demos',
  standalone: true,
  imports: [Card, MenuRoot, MenuList, MenuItem, MenuDivider, MenuGroup, MenuGroupLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './restored-demos.component.html',
})
export class MenuRestoredDemosComponent {
  protected readonly basicOpen = signal(true)
  protected readonly selected = signal('dashboard')
  protected readonly controlledOpen = signal(true)
  protected readonly controlledSelected = signal('users')
  protected readonly multipleItems = ['users', 'roles', 'articles', 'comments']
  protected readonly multiple = signal(new Set(['users', 'articles']))
  protected readonly rootClass = rootClassName
  protected readonly itemClass = verticalItemClassName
  protected readonly listClass = verticalListClassName

  protected toggle(value: string) {
    this.multiple.update((current) => {
      const next = new Set(current)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }
}
