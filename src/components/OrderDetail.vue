<template>
  <div v-if="order" class="order-detail-page">
    <h2>Заказ от {{ formatDate(order.created_at) }}</h2>

    <!-- Таблица товаров в заказе -->
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
        <tr v-for="item in order.items" :key="item.id">
          <td>{{ item.product_name }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ formatPrice(item.price) }}</td>
          <td>${{ formatPrice(item.total_price) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="total-label">Итоговая сумма:</td>
          <td class="total-cost">${{ formatPrice(order.total_price) }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Статус заказа -->
    <div class="order-status">
      <p><strong>Статус заказа:</strong> {{ orderStatus(order.status) }}</p>
    </div>

    <!-- Адреса доставки -->
    <div class="address-info" v-if="order.addresses && order.addresses.length">
      <h3>Адреса доставки</h3>
      <div
        v-for="address in order.addresses"
        :key="address.id"
        class="address-card"
      >
        <p><strong>Страна:</strong> {{ address.country }}</p>
        <p><strong>Город:</strong> {{ address.city }}</p>
        <p><strong>Улица:</strong> {{ address.street }}</p>
        <p><strong>Дом:</strong> {{ address.house }}</p>
        <p v-if="address.apartment">
          <strong>Квартира:</strong> {{ address.apartment }}
        </p>
        <p><strong>Почтовый индекс:</strong> {{ address.postal_code }}</p>
      </div>
    </div>

    <!-- Форма оплаты (только если статус заказа - ожидание оплаты) -->
    <div v-if="order.status === 'pending'" class="payment-form">
      <h3>Введите данные для оплаты</h3>
      <form @submit.prevent="processPayment">
        <div>
          <label for="cardNumber">Номер карты:</label>
          <input
            type="text"
            id="cardNumber"
            v-model="paymentData.cardNumber"
            required
          />
        </div>
        <div>
          <label for="cardHolder">Имя владельца:</label>
          <input
            type="text"
            id="cardHolder"
            v-model="paymentData.cardHolder"
            required
          />
        </div>
        <div>
          <label for="expiryDate">Дата окончания:</label>
          <input
            type="text"
            id="expiryDate"
            v-model="paymentData.expiryDate"
            placeholder="MM/YY"
            required
          />
        </div>
        <div>
          <label for="cvv">CVV:</label>
          <input type="text" id="cvv" v-model="paymentData.cvv" required />
        </div>
        <button type="submit" class="pay-order-btn">Оплатить заказ</button>
      </form>
    </div>
  </div>

  <div v-else class="loading">Загрузка данных заказа...</div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      paymentData: {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      },
    }
  },
  async created() {
    const orderId = this.$route.params.id
    await this.fetchOrder(orderId)
  },
  methods: {
    async fetchOrder(id) {
      try {
        const {data} = await apiClient.get(`/orders/${id}`)
        this.order = data
      } catch (error) {
        console.error('Ошибка при получении данных заказа:', error)
      }
    },
    formatDate(date) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'}
      return new Date(date).toLocaleDateString('ru-RU', options)
    },
    formatPrice(value) {
      return parseFloat(value).toFixed(2)
    },
    orderStatus(status) {
      return status === 'pending' ? 'В ожидании оплаты' : 'Оплачен'
    },
    async processPayment() {
      try {
        await apiClient.post('http://localhost/api/payment/process', {
          order_id: this.order.id,
          amount: this.order.total_price,
        })
        alert('Ваш заказ оплачен')
        // Перезагрузить данные заказа, чтобы обновить статус
        await this.fetchOrder(this.order.id)
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
  max-width: calc(100% - 462px);
  margin: 0 auto;
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

.order-status,
.payment-form,
.delivery-addresses {
  margin-top: 20px;
}

.payment-form div {
  margin-bottom: 10px;
}

.payment-form label {
  display: block;
  font-weight: bold;
}

.payment-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pay-order-btn {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

/* Стиль для адресов */
.address-info {
  margin-top: 20px;
}

.address-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.address-card p {
  margin: 4px 0;
}
</style>
