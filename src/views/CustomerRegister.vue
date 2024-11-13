<template>
  <div class="register-container">
    <h2>Регистрация клиента</h2>
    <form @submit.prevent="register" class="register-form">
      <div>
        <input
          v-model="name"
          type="text"
          required
          placeholder="Имя"
          class="input-field"
        />
      </div>
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
        class="register-button"
        :disabled="!name || !email || !password"
      >
        Зарегистрироваться
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'CustomerRegister',
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
/* Контейнер для всей формы */
.register-container {
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
.register-form {
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

/* Кнопка регистрации (в стиле кнопки входа) */
.register-button {
  background-color: #ccc;
  color: #333;
  padding: 10px 16px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Стили для задизейбленной кнопки */
.register-button:disabled {
  background-color: #e0e0e0;
  color: #888;
  cursor: not-allowed;
}

.register-button:hover:not(:disabled) {
  background-color: #bbb;
}

/* Сообщение об ошибке */
.error {
  color: red;
  margin-top: 10px;
}
</style>
