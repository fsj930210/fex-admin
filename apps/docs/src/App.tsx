import { NavLink, Route, Routes } from 'react-router'
import Dialog from '../content/components/dialog.mdx'
import Introduction from '../content/getting-started/introduction.mdx'

export function App() {
  return (
    <div className="docs-shell">
      <aside>
        <strong>Fex Admin</strong>
        <nav>
          <NavLink to="/">介绍</NavLink>
          <NavLink to="/components/dialog">Dialog</NavLink>
        </nav>
      </aside>
      <article>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/components/dialog" element={<Dialog />} />
        </Routes>
      </article>
    </div>
  )
}
