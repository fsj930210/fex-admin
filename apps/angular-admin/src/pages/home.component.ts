import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'fex-home',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Angular Admin</h1>
      <p>Vite 与 Angular Router 已连接。</p>
      <a routerLink="/button">Button</a>
      <a routerLink="/card">Card</a>
      <a routerLink="/route-test">测试路由</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
