import type { Routes } from '@angular/router'

export const baseRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../../pages/home.component').then((module) => module.HomeComponent),
  },
]
