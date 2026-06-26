import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'fex-route-test',
  imports: [RouterLink],
  template:
    '<main><span class="badge">ROUTE OK</span><h1>Angular 路由正常</h1><p>这是由 Angular Router 渲染的第二个页面。</p><a routerLink="/">返回首页</a></main>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteTestComponent {}
