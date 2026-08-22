import { createRouter, createWebHistory } from 'vue-router'
import { baseRoutes } from './base'
import { componentRoutes } from './components'

export const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRoutes, ...componentRoutes],
})
