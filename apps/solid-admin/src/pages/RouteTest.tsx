import { A } from '@solidjs/router'

export function RouteTest() {
  return (
    <main>
      <span class="badge">ROUTE OK</span>
      <h1>Solid 路由正常</h1>
      <p>这是由 @solidjs/router 渲染的第二个页面。</p>
      <A href="/">返回首页</A>
    </main>
  )
}
