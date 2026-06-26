import { Link } from 'react-router'

export function RouteTestPage() {
  return (
    <main>
      <span className="badge">ROUTE OK</span>
      <h1>React 路由正常</h1>
      <p>这是由 react-router 渲染的第二个页面。</p>
      <Link to="/">返回首页</Link>
    </main>
  )
}
