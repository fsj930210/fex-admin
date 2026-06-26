import type { Routes } from '@angular/router'
import { baseRoutes } from './base'
import { componentRoutes } from './components'

export const routes: Routes = [...baseRoutes, ...componentRoutes]
