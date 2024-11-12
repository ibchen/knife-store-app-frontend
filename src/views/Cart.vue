<template>
  <div class="cart-page">
    <h2>Корзина</h2>
    <div v-if="!isAuthorized">
      <p>Вы должны войти в систему, чтобы просмотреть корзину.</p>
      <router-link to="/login">Войти</router-link>
    </div>
    <div v-else>
      <div v-if="cartItems.length">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <h3>{{ item.product.name }}</h3>
          <p>{{ item.product.description }}</p>
          <p>Цена: ${{ item.product.price }}</p>
          <p>
            Количество:
            <input
              type="number"
              v-model.number="item.quantity"
              @change="updateQuantity(item)"
              min="1"
            />
          </p>
          <p>Итого: ${{ (item.product.price * item.quantity).toFixed(2) }}</p>
          <button @click="removeItem(item.id)">Удалить</button>
        </div>
        <div class="cart-summary">
          <h3>Общая стоимость: ${{ totalCost.toFixed(2) }}</h3>
          <button class="place-order-btn" @click="placeOrder">
            Оформить заказ
          </button>
        </div>
      </div>
      <div v-else>
        <p>Ваша корзина пуста</p>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'CartView',
  data() {
    return {
      cartItems: [],
      isAuthorized: true,
      errorMessage: '',
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
  },
  methods: {
    async fetchCartItems() {
      try {
        const response = await apiClient.get('/cart')
        this.cartItems = response.data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.isAuthorized = false
        } else {
          this.errorMessage = 'Ошибка при получении данных корзины'
          console.error('Ошибка при получении корзины:', error)
        }
      }
    },
    async updateQuantity(item) {
      try {
        await apiClient.patch(`/cart/update/${item.id}`, {
          quantity: item.quantity,
        })
        this.fetchCartItems()
      } catch (error) {
        console.error('Ошибка при обновлении количества товара:', error)
      }
    },
    async removeItem(itemId) {
      try {
        await apiClient.delete(`/cart/remove/${itemId}`)
        this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
      } catch (error) {
        console.error('Ошибка при удалении товара:', error)
      }
    },
    async placeOrder() {
      try {
        const response = await apiClient.post('/order/place')
        const orderId = response.data.order_id
        this.$router.push({name: 'OrderDetail', params: {id: orderId}})
      } catch (error) {
        this.errorMessage = 'Ошибка при создании заказа'
        console.error('Ошибка при создании заказа:', error)
      }
    },
  },
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
}

.cart-item {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 10px;
}

.cart-summary {
  margin-top: 20px;
  font-size: 1.2em;
  font-weight: bold;
}

button {
  background-color: red;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.place-order-btn {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
