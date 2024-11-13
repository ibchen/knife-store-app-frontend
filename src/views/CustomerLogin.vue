<template>
  <div class="login-container">
    <h2>Вход для клиентов</h2>
    <form @submit.prevent="login" class="login-form">
      <div>
        <input
          v-model="email"
          type="email"
          required
          placeholder="Email"
          class="input-field"
        />
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          required
          placeholder="Пароль"
          class="input-field"
        />
      </div>
      <button
        type="submit"
        class="login-button"
        :disabled="!email || !password"
      >
        Войти
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../api'

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
        await apiClient.get('/sanctum/csrf-cookie')
        const response = await apiClient.post('/customer/login', {
          email: this.email,
          password: this.password,
        })
        const token = response.data.token
        localStorage.setItem('authToken', token)
        this.$emit('auth-changed')
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
/* Контейнер для всей формы */
.login-container {
  max-width: 400px;
  margin: 20px auto; /* Отступ сверху */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-color: #f9f9f9;
}

/* Заголовок формы */
h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
}

/* Форма */
.login-form {
  display: flex;
  flex-direction: column;
}

/* Поля ввода (полная ширина карточки) */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Кнопка входа (в стиле кнопки на Product Detail) */
.login-button {
  background-color: #ccc;
  color: #333;
  padding: 10px 16px;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #bbb;
}

.login-button:disabled {
  background-color: #e0e0e0;
  color: #888;
  cursor: not-allowed;
}

/* Сообщение об ошибке */
.error {
  color: red;
  margin-top: 10px;
}
</style>
