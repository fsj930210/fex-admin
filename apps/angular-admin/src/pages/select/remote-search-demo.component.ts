import type { SelectOption } from '@fex/components-core/select/types'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core'
import type { OnDestroy } from '@angular/core'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
import Card from '@fex/components-angular/ui/card'
import { frameworkOptions } from './data'
export
@Component({
  selector: 'fex-select-remote-search-demo',
  standalone: true,
  imports: [Card, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './remote-search-demo.component.html',
})
class RemoteSearchDemo implements OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef)
  protected options: readonly SelectOption[] = []
  protected loading = false
  protected open = false
  private searchTimer: number | undefined
  protected search(keyword: string) {
    const normalized = keyword.trim().toLocaleLowerCase()
    if (this.searchTimer !== undefined) window.clearTimeout(this.searchTimer)
    this.open = true
    if (!normalized) {
      this.loading = false
      this.options = []
      this.searchTimer = undefined
      return
    }
    this.loading = true
    this.options = []
    this.searchTimer = window.setTimeout(() => {
      this.options = frameworkOptions.filter((option) =>
        [option.label, option.searchText, ...(option.keywords ?? [])].some((text) =>
          text?.toLocaleLowerCase().includes(normalized),
        ),
      )
      this.loading = false
      this.open = true
      this.searchTimer = undefined
      this.changeDetectorRef.detectChanges()
    }, 2000)
  }
  ngOnDestroy() {
    if (this.searchTimer !== undefined) window.clearTimeout(this.searchTimer)
  }
}
