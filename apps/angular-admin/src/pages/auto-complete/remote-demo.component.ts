import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex/components-angular/primitive/auto-complete'
import Card from '@fex/components-angular/ui/card'
import { fieldNames, users, type UserSuggestion } from './data'

@Component({
  selector: 'fex-auto-complete-remote-demo',
  standalone: true,
  imports: [Card, AutoCompleteRoot, AutoCompleteTrigger, AutoCompleteContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './remote-demo.component.html',
})
export class RemoteDemo {
  protected readonly items = signal<UserSuggestion[]>([])
  protected readonly loading = signal(false)
  protected readonly fieldNames = fieldNames
  private timer?: ReturnType<typeof setTimeout>
  private request = 0
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.request++
      if (this.timer) clearTimeout(this.timer)
    })
  }
  protected search(event: { value: string }) {
    if (this.timer) clearTimeout(this.timer)
    const current = ++this.request
    this.loading.set(true)
    this.timer = setTimeout(() => {
      if (current !== this.request) return
      const normalized = event.value.trim().toLocaleLowerCase()
      this.items.set(users.filter((item) => item.name.toLocaleLowerCase().includes(normalized)))
      this.loading.set(false)
    }, 600)
  }
}
