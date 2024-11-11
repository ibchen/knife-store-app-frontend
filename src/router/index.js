import {createRouter, createWebHistory} from 'vue-router'
import CustomerLogin from '@/views/CustomerLogin'
import CustomerRegister from '@/views/CustomerRegister'
import Products from '@/views/Products.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import CustomerProfile from '@/views/CustomerProfile.vue'

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
    props: (route) => ({page: parseInt(route.query.page) || 1}),
  },
  {
    path: '/products/:id',
    name: 'product',
    component: ProductDetail,
  },
  {
    path: '/profile',
    name: 'profile',
    component: CustomerProfile,
    meta: {requiresAuth: true}, // Маршрут требует аутентификации
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

// Middleware для проверки аутентификации
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken')

  // Если маршрут требует аутентификации и пользователь не авторизован
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({name: 'login'}) // Перенаправляем на страницу входа
  } else {
    next()
  }
})

export default router
