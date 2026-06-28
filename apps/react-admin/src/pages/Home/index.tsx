import { Link } from 'react-router'

export function HomePage() {
  return (
    <main>
      <h1>React Admin</h1>
      <p>Vite 与 React Router 已连接。</p>
      <Link to="/button">Button</Link>
      <Link to="/card">Card</Link>
      <Link to="/route-test">测试路由</Link>
    </main>
  )
}
