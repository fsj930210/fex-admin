export const baseRoutes = [
  { path: '/', component: () => import('../../pages/Home.vue') },
  { path: '/route-test', component: () => import('../../pages/RouteTest.vue') },
]
