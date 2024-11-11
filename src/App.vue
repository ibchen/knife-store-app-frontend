<template>
  <div>
    <!-- Навигационная панель -->
    <header class="navbar">
      <h1 @click="goToHome" class="logo">My Store</h1>
      <nav>
        <ul>
          <li v-if="isAuthenticated">
            <router-link to="/profile">Profile</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/cart">Cart</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login">Login</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="isAuthenticated" @click="logout">Logout</li>
        </ul>
      </nav>
    </header>

    <!-- Основное содержимое страницы -->
    <router-view @auth-changed="checkAuth" />
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

export default {
  setup() {
    const isAuthenticated = ref(false)
    const router = useRouter()

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

    onMounted(() => {
      checkAuth()
    })

    return {isAuthenticated, goToHome, logout, checkAuth}
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

nav ul li:hover {
  text-decoration: underline;
}
</style>
