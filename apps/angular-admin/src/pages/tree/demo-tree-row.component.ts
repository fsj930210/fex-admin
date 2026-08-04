import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import type { TreeController, TreeVisibleItem } from '@fex-design/core/tree/types'
import {
  TreeItemDirective,
  TreeTitleDirective,
  TreeTriggerDirective,
} from '@fex-design/angular/primitive/tree'
import { ChevronDownIcon } from '@fex-design/angular/icon/chevron'
import { Checkbox } from '@fex-design/angular/ui/checkbox'
import { Spinner } from '@fex-design/angular/ui/spinner'
import type { DepartmentNode } from './data'
export
@Component({
  selector: 'fex-demo-tree-row',
  standalone: true,
  imports: [
    TreeItemDirective,
    TreeTitleDirective,
    TreeTriggerDirective,
    ChevronDownIcon,
    Checkbox,
    Spinner,
  ],
  templateUrl: './demo-tree-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DemoTreeRowComponent {
  readonly tree = input.required<TreeController<DepartmentNode>>()
  readonly item = input.required<TreeVisibleItem<DepartmentNode>>()
  readonly checkable = input(false)
  readonly searchKeyword = input('')
  parts() {
    const title = this.item().node.name,
      keyword = this.searchKeyword(),
      index = title.toLowerCase().indexOf(keyword.toLowerCase())
    return !keyword || index < 0
      ? { before: title, match: '', after: '' }
      : {
          before: title.slice(0, index),
          match: title.slice(index, index + keyword.length),
          after: title.slice(index + keyword.length),
        }
  }
}
