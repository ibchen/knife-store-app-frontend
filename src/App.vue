<template>
  <div>
    <!-- Навигационная панель -->
    <header class="navbar">
      <h1 @click="goToHome" class="logo">Открытка из Золингена</h1>
      <nav>
        <ul>
          <li
            v-if="isAuthenticated"
            :class="{active: isRouteActive('/profile')}"
          >
            <router-link to="/profile">Профиль</router-link>
          </li>
          <li v-if="isAuthenticated" :class="{active: isRouteActive('/cart')}">
            <router-link to="/cart">Корзина</router-link>
          </li>
          <li
            v-if="isAuthenticated"
            :class="{active: isRouteActive('/orders')}"
          >
            <router-link to="/orders">Заказы</router-link>
          </li>
          <li
            v-if="!isAuthenticated"
            :class="{active: isRouteActive('/login')}"
          >
            <router-link to="/login">Вход</router-link>
          </li>
          <li
            v-if="!isAuthenticated"
            :class="{active: isRouteActive('/register')}"
          >
            <router-link to="/register">Регистрация</router-link>
          </li>
          <li v-if="isAuthenticated" @click="logout">Выход</li>
        </ul>
      </nav>
    </header>

    <!-- Основное содержимое страницы -->
    <router-view @auth-changed="checkAuth" />
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'

export default {
  setup() {
    const isAuthenticated = ref(false)
    const router = useRouter()
    const route = useRoute()

    // Проверка аутентификации на основе токена в localStorage
    const checkAuth = () => {
      isAuthenticated.value = !!localStorage.getItem('authToken')
    }

    // Перейти на домашнюю страницу
    const goToHome = () => {
      router.push({name: 'products'})
    }

    // Логаут пользователя
    const logout = () => {
      localStorage.removeItem('authToken')
      isAuthenticated.value = false
      router.push({name: 'login'})
    }

    // Проверка, активен ли маршрут
    const isRouteActive = (path) => {
      return route.path.startsWith(path)
    }

    onMounted(() => {
      checkAuth()
    })

    return {isAuthenticated, goToHome, logout, checkAuth, isRouteActive}
  },
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #333;
  color: #fff;
}

.logo {
  cursor: pointer;
  font-size: 1.5rem;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav ul li {
  cursor: pointer;
  color: #fff;
}

nav ul li a {
  color: inherit;
  text-decoration: none;
}

nav ul li.active a {
  font-weight: bold;
  color: #fff;
}

nav ul li:hover a {
  text-decoration: underline;
}
</style>
