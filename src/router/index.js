import {createRouter, createWebHistory} from 'vue-router'
import CustomerLogin from '@/views/CustomerLogin'
import CustomerRegister from '@/views/CustomerRegister'
import Products from '@/views/Products'

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
    path: '/products',
    name: 'products',
    component: Products,
  },
]

const router = new createRouter({
  routes,
  history: createWebHistory(),
})

export default router
