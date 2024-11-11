<template>
  <div>
    <h2>Customer Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input
          v-model="email"
          id="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          v-model="password"
          id="password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'KsaCustomerLogin',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    async login() {
      try {
        await apiClient.get('/sanctum/csrf-cookie')

        const response = await apiClient.post('/customer/login', {
          email: this.email,
          password: this.password,
        })

        const token = response.data.token
        localStorage.setItem('authToken', token)

        this.$emit('auth-changed') // Уведомляем App.vue об изменении

        this.$router.push({name: 'products'})
      } catch (error) {
        if (error.response && error.response.status === 419) {
          this.errorMessage =
            'CSRF токен не совпадает. Попробуйте обновить страницу.'
        } else if (error.response && error.response.status === 401) {
          this.errorMessage = 'Неверные учетные данные. Попробуйте снова.'
        } else {
          this.errorMessage = 'Произошла ошибка при попытке входа.'
        }
      }
    },
  },
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
}
label {
  margin-bottom: 5px;
}
input {
  padding: 8px;
  margin-bottom: 15px;
  font-size: 1em;
}
button {
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
}
</style>
