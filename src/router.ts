import { createRouter, createWebHistory } from 'vue-router'
import RouteOne from './views/RouteOne.vue'
import RouteTwo from './views/RouteTwo.vue'
import RouteThree from './views/RouteThree.vue'

const routes = [
  { path: '/route1', component: RouteOne },
  { path: '/route2', component: RouteTwo },
  { path: '/route3', component: RouteThree },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
