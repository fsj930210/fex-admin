import { A } from '@solidjs/router'

export function Home() {
  return (
    <main>
      <h1>Solid Admin</h1>
      <p>Vite 与 Solid Router 已连接。</p>
      <A href="/button">Button</A>
      <A href="/card">Card</A>
      <A href="/route-test">测试路由</A>
    </main>
  )
}
