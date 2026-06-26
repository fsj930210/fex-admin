import { Route, Routes } from 'react-router'
import { baseRoutes } from './base'
import { componentRoutes } from './components'

const routes = [...baseRoutes, ...componentRoutes]

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
