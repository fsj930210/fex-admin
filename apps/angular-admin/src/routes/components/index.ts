import type { Routes } from '@angular/router'

export const componentRoutes: Routes = [
  {
    path: 'button',
    loadComponent: () =>
      import('../../pages/button/index.component').then((module) => module.ButtonComponent),
  },
]
