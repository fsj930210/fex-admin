import type { CascaderOption } from '@fex-design/core/cascader/types'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
import { regionOptions } from './data'
import { SimpleCascaderDemo } from './simple-demo.component'
@Component({ selector:'fex-cascader-async-value-demo', standalone:true, imports:[SimpleCascaderDemo], changeDetection:ChangeDetectionStrategy.OnPush, template:'<fex-cascader-simple-demo title="Asynchronous value display" description="The path survives until labels arrive." [options]="options()" [value]="value" [loading]="loading()" />' })
export class AsyncValueDemo implements OnInit,OnDestroy {
  readonly options=signal<readonly CascaderOption[]>([])
  readonly loading=signal(true)
  readonly value=['zhejiang','hangzhou','xihu']
  private timer!:ReturnType<typeof setTimeout>
  ngOnInit(){this.timer=setTimeout(()=>{this.options.set(regionOptions);this.loading.set(false)},900)}
  ngOnDestroy(){clearTimeout(this.timer)}
}
