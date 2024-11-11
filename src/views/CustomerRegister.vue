<template>
  <div>
    <h2>Customer Registration</h2>
    <form @submit.prevent="register">
      <div>
        <label for="name">Name:</label>
        <input
          v-model="name"
          id="name"
          type="text"
          required
          placeholder="Enter your name"
        />
      </div>
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
      <button type="submit">Register</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'KsaCustomerRegister',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    async register() {
      try {
        await apiClient.get('/sanctum/csrf-cookie')

        const response = await apiClient.post('/customer/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        })

        const token = response.data.token
        localStorage.setItem('authToken', token)

        this.$emit('auth-changed') // Уведомляем App.vue об изменении

        this.$router.push({name: 'products'})
      } catch (error) {
        this.errorMessage = 'Ошибка при регистрации. Попробуйте снова.'
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
