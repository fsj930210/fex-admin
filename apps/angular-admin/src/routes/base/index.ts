import type { Routes } from '@angular/router'

export const baseRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../../pages/home.component').then((module) => module.HomeComponent),
  },
  {
    path: 'route-test',
    loadComponent: () =>
      import('../../pages/route-test.component').then((module) => module.RouteTestComponent),
  },
]
