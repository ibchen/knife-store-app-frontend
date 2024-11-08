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
import apiClient from '../api' // предполагается, что вы создали apiClient для работы с API

export default {
  name: 'CustomerLogin',
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
        // Шаг 1: Получение CSRF-cookie
        await apiClient.get('/sanctum/csrf-cookie')

        // Шаг 2: Отправка данных для входа
        const response = await apiClient.post('/customer/login', {
          email: this.email,
          password: this.password,
        })

        // Сохранение токена или обработка успешного входа
        console.log(response.data)
      } catch (error) {
        console.error('Ошибка при входе:', error)
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
