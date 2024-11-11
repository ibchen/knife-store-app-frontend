<template>
  <div class="order-detail-page">
    <h2>Детали заказа</h2>

    <!-- Таблица товаров в заказе -->
    <table class="order-table" v-if="cartItems.length">
      <thead>
        <tr>
          <th>Название</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Итого</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.product.name }}</td>
          <td>${{ item.product.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ (item.product.price * item.quantity).toFixed(2) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="total-label">Общая стоимость:</td>
          <td class="total-cost">${{ totalCost.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Данные пользователя -->
    <div class="user-info">
      <h3>Информация о пользователе</h3>
      <p>Имя: {{ userProfile.name }}</p>
      <p>Email: {{ userProfile.email }}</p>
    </div>

    <!-- Кнопка для оплаты заказа -->
    <button class="pay-order-btn" @click="processPayment">
      Оплатить заказ
    </button>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'OrderDetail',
  data() {
    return {
      cartItems: [],
      userProfile: {
        name: '',
        email: '',
      },
    }
  },
  computed: {
    totalCost() {
      return this.cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    },
  },
  created() {
    this.fetchCartItems()
    this.fetchUserProfile()
  },
  methods: {
    async fetchCartItems() {
      try {
        const response = await apiClient.get('/cart')
        this.cartItems = response.data
      } catch (error) {
        console.error('Ошибка при получении данных корзины:', error)
      }
    },
    async fetchUserProfile() {
      try {
        const response = await apiClient.get('/customer/profile')
        this.userProfile = response.data.data
      } catch (error) {
        console.error('Ошибка при получении данных профиля:', error)
      }
    },
    async processPayment() {
      try {
        const response = await apiClient.post('/payment/process')
        alert('Оплата прошла успешно!')
        this.$router.push({name: 'Orders'}) // Переход на страницу заказов после оплаты
      } catch (error) {
        console.error('Ошибка при обработке платежа:', error)
        alert('Ошибка при обработке платежа')
      }
    },
  },
}
</script>

<style scoped>
.order-detail-page {
  padding: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.order-table th {
  background-color: #f4f4f4;
}

.total-label {
  font-weight: bold;
  text-align: right;
}

.total-cost {
  font-weight: bold;
  text-align: right;
}

.user-info {
  margin-top: 30px;
  padding: 16px;
  border-top: 1px solid #ddd;
}

.pay-order-btn {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
