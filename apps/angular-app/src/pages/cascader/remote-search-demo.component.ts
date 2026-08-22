import type { CascaderOption } from '@fex-design/core/cascader/types'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import type { OnDestroy } from '@angular/core'
import { CascaderContent, CascaderPanel, CascaderRoot, CascaderTrigger } from '@fex-design/angular/primitive/cascader'
import Card from '@fex-design/angular/ui/card'
import { remoteRegionSearch } from './data'
@Component({ selector:'fex-cascader-remote-search-demo', standalone:true, imports:[Card,CascaderRoot,CascaderTrigger,CascaderContent,CascaderPanel], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./remote-search-demo.component.html' })
export class RemoteSearchDemo implements OnDestroy {
  readonly options=signal<readonly CascaderOption[]>([])
  readonly loading=signal(false)
  private timer:ReturnType<typeof setTimeout>|undefined
  private request=0
  search(keyword:string){
    if(this.timer)clearTimeout(this.timer)
    const id=++this.request
    if(!keyword.trim()){this.loading.set(false);return}
    this.loading.set(true)
    this.timer=setTimeout(()=>{if(id!==this.request)return;this.options.set(remoteRegionSearch(keyword));this.loading.set(false)},800)
  }
  ngOnDestroy(){this.request++;if(this.timer)clearTimeout(this.timer)}
}
