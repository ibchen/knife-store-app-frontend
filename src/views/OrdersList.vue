<template>
  <div class="orders-list">
    <h2>Ваши заказы</h2>
    <div v-if="orders.length">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="goToOrderDetail(order.id)"
      >
        <!-- Заголовок заказа -->
        <div class="order-header">
          Заказ от {{ formatDate(order.created_at) }}
        </div>

        <!-- Таблица позиций заказа -->
        <table class="order-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Количество</th>
              <th>Цена за единицу</th>
              <th>Общая сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id" class="order-item">
              <td>{{ item.product_name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ formatPrice(item.price) }}</td>
              <td>${{ formatPrice(item.total_price) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="order-total">
              <td colspan="3" class="total-label">Итоговая сумма:</td>
              <td class="total-amount">
                ${{ formatPrice(order.total_price) }}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Статус заказа -->
        <div class="order-status">
          {{ orderStatus(order.status) }}
        </div>
      </div>
    </div>
    <div v-else>
      <p>У вас нет заказов.</p>
    </div>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'OrdersList',
  data() {
    return {
      orders: [],
      errorMessage: '',
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await apiClient.get('/orders')
        this.orders = response.data.map((order) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }))
      } catch (error) {
        this.errorMessage = 'Ошибка при загрузке заказов.'
        console.error('Ошибка при загрузке заказов:', error)
      }
    },
    orderStatus(status) {
      return status === 'pending' ? 'В ожидании оплаты' : status
    },
    goToOrderDetail(orderId) {
      this.$router.push({name: 'OrderDetail', params: {id: orderId}})
    },
    formatPrice(value) {
      const price = parseFloat(value)
      return isNaN(price) ? '0.00' : price.toFixed(2)
    },
    formatDate(date) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'}
      return new Date(date).toLocaleDateString('ru-RU', options)
    },
  },
}
</script>

<style scoped>
.orders-list {
  padding: 20px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  padding: 15px;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.order-header {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.order-table thead th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.order-item td {
  background-color: #fafafa;
}

.order-total .total-label {
  text-align: right;
  font-weight: bold;
}

.total-amount {
  font-weight: bold;
  text-align: right;
  color: #333;
}

.order-status {
  text-align: center;
  font-size: 1em;
  color: #333;
  margin-top: 10px;
  font-weight: bold;
}
</style>
