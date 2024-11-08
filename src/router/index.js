import {createRouter, createWebHistory} from 'vue-router'
import CustomerLogin from '@/views/CustomerLogin'
import CustomerRegister from '@/views/CustomerRegister'
import HomePage from '@/views/HomePage'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: CustomerLogin,
  },

  {
    path: '/register',
    name: 'register',
    component: CustomerRegister,
  },

  {
    path: '/home',
    name: 'home',
    component: HomePage,
  },
]

const router = new createRouter({
  routes,
  history: createWebHistory(),
})

export default router
