import type { CascaderOption } from '@fex-design/core/cascader/types'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { lazyInitialOptions } from './data'
import { SimpleCascaderDemo } from './simple-demo.component'

@Component({
  selector: 'fex-cascader-lazy-load-demo',
  standalone: true,
  imports: [SimpleCascaderDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<fex-cascader-simple-demo title="Lazy load" description="Unresolved nodes load one path and reject duplicate requests." [options]="options()" [loadData]="load" />',
})
export class LazyLoadDemo {
  readonly options = signal<readonly CascaderOption[]>(lazyInitialOptions)

  readonly load = async (path: readonly CascaderOption[]) => {
    await new Promise(resolve => setTimeout(resolve, 700))
    const key = String(path.at(-1)?.value)
    this.options.update(options => options.map(item => item.value === key
      ? { ...item, children: key === 'asia' ? [{ value: 'china', label: '中国', isLeaf: false }] : [{ value: 'france', label: '法国' }] }
      : item))
    if (key === 'china') {
      this.options.update(options => options.map(item => item.value === 'asia'
        ? { ...item, children: [{ value: 'china', label: '中国', children: [{ value: 'hangzhou', label: '杭州' }] }] }
        : item))
    }
  }
}
