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
          <div v-if="item.product" class="item-content">
            <!-- Левая колонка: миниатюра товара -->
            <div class="item-image">
              <img
                :src="item.product.image_urls?.[0] || ''"
                alt="Product Image"
              />
              <button class="remove-btn" @click="removeItem(item.id)">
                Удалить
              </button>
            </div>

            <!-- Правая колонка: информация о товаре -->
            <div class="item-info">
              <h3>{{ item.product.name }}</h3>
              <p class="price">Цена: ${{ item.product.price }}</p>
              <div class="quantity">
                <label>Количество:</label>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  @change="updateQuantity(item)"
                  min="1"
                />
              </div>
              <p class="total">
                Итого: ${{ (item.product.price * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Общая стоимость и кнопка "Оформить заказ" -->
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
      cartItems: [], // Товары в корзине
      isAuthorized: true, // Авторизация пользователя
      errorMessage: '', // Сообщение об ошибке
    }
  },
  computed: {
    /**
     * Подсчет общей стоимости корзины.
     */
    totalCost() {
      return this.cartItems.reduce((acc, item) => {
        return item.product ? acc + item.product.price * item.quantity : acc
      }, 0)
    },
  },
  created() {
    this.fetchCartItems() // Загрузка товаров корзины при создании компонента
  },
  methods: {
    /**
     * Получение данных корзины.
     */
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
    /**
     * Обновление количества товара.
     */
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
    /**
     * Удаление товара из корзины.
     */
    async removeItem(itemId) {
      try {
        await apiClient.delete(`/cart/remove/${itemId}`)
        this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
      } catch (error) {
        console.error('Ошибка при удалении товара:', error)
      }
    },
    /**
     * Оформление заказа.
     */
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
  max-width: calc(100% - 462px);
  margin: 0 auto;
}

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 10px;
}

.item-content {
  display: flex;
  width: 100%;
}

.item-image {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}

.remove-btn {
  width: 100%;
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

.remove-btn:hover {
  background-color: #bbb;
}

.item-info {
  flex: 1;
  padding-left: 16px;
}

h3 {
  font-size: 1.2em;
  margin-bottom: 8px;
}

.price,
.total {
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 4px;
}

.quantity {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.quantity label {
  margin-right: 8px;
}

.quantity input {
  width: 60px;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 20px;
}

.place-order-btn {
  background-color: grey;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
