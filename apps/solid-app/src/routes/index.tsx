import { Route } from '@solidjs/router'
import { For } from 'solid-js'
import { baseRoutes } from './base'
import { componentRoutes } from './components'

const routes = [...baseRoutes, ...componentRoutes]

export function AppRoutes() {
  return (
    <For each={routes}>{(route) => <Route path={route.path} component={route.component} />}</For>
  )
}
