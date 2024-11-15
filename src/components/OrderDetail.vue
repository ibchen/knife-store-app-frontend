<template>
  <div v-if="order" class="order-detail-page">
    <!-- Заголовок -->
    <h2>Заказ от {{ formatDate(order.created_at) }}</h2>

    <!-- Таблица товаров -->
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

    <div class="order-status">
      <p>{{ orderStatus(order.status) }}</p>
    </div>

    <!-- Секция с адресами и оплатой -->
    <div class="order-content">
      <!-- Левая часть: Адрес доставки -->
      <div class="left-section">
        <h3>Адрес доставки</h3>

        <!-- Карточка выбранного адреса после оплаты -->
        <div v-if="isOrderPaid" class="address-card">
          <p><strong>Выбранный адрес доставки</strong></p>
          <p><strong>Страна:</strong> {{ deliveryAddress.country }}</p>
          <p><strong>Город:</strong> {{ deliveryAddress.city }}</p>
          <p><strong>Улица:</strong> {{ deliveryAddress.street }}</p>
          <p><strong>Дом:</strong> {{ deliveryAddress.house }}</p>
          <p v-if="deliveryAddress.apartment">
            <strong>Квартира:</strong> {{ deliveryAddress.apartment }}
          </p>
          <p>
            <strong>Почтовый индекс:</strong> {{ deliveryAddress.postal_code }}
          </p>
        </div>

        <!-- Список всех адресов доставки до оплаты -->
        <div
          v-else
          v-for="address in order.addresses"
          :key="address.id"
          class="address-card"
        >
          <div class="radio-field">
            <input
              type="radio"
              :id="'address-' + address.id"
              name="selectedAddress"
              :value="address.id"
              v-model="selectedAddress"
            />
            <label :for="'address-' + address.id">
              {{
                selectedAddress === address.id
                  ? 'Выбранный адрес доставки'
                  : 'Выбрать адрес'
              }}
            </label>
          </div>
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

      <!-- Правая часть: Данные оплаты -->
      <div class="right-section">
        <div class="payment-form" v-if="order.status === 'pending'">
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
            <div class="inline-fields">
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
                <input
                  type="text"
                  id="cvv"
                  v-model="paymentData.cvv"
                  required
                />
              </div>
            </div>
            <button type="submit" class="pay-order-btn">Оплатить заказ</button>
          </form>
        </div>
      </div>
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
      selectedAddress: null,
      deliveryAddress: {}, // Данные выбранного адреса доставки после оплаты
      paymentData: {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      },
    }
  },
  computed: {
    isOrderPaid() {
      return this.order.status === 'paid'
    },
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

        if (this.isOrderPaid && data.delivery_address) {
          this.deliveryAddress = data.delivery_address
        } else {
          const primaryAddress = this.order.addresses.find(
            (address) => address.is_primary
          )
          if (primaryAddress) {
            this.selectedAddress = primaryAddress.id
          }
        }
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
      return status === 'pending'
        ? 'В ожидании оплаты'
        : status === 'paid'
        ? 'Оплачен'
        : status
    },
    async processPayment() {
      if (!this.selectedAddress) {
        alert('Пожалуйста, выберите адрес доставки.')
        return
      }

      const deliveryAddress = this.order.addresses.find(
        (address) => address.id === this.selectedAddress
      )

      try {
        const response = await apiClient.post('/payment/process', {
          order_id: this.order.id,
          amount: this.order.total_price,
          delivery_address: deliveryAddress,
        })

        alert('Ваш заказ оплачен')

        // Обновляем статус заказа и адрес доставки
        this.order.status = 'paid'
        this.deliveryAddress = response.data.delivery_address
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
  max-width: calc(100% - 462px); /* Отступы такие же, как в корзине */
  margin: 0 auto;
}

.order-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.left-section {
  flex: 1;
  max-width: 50%;
}

.right-section {
  flex: 1;
  max-width: 50%;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
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

/* Стиль для статуса заказа */
.order-status {
  text-align: center;
  font-size: 1em;
  color: #333;
  margin-top: 10px;
  font-weight: bold;
}

.address-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
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
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.radio-field {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.radio-field input[type='radio'] {
  margin: 0;
}

/* Стили для строки с датой окончания и CVV-кодом */
.payment-form .inline-fields {
  display: flex;
  gap: 10px;
}

.payment-form .inline-fields input {
  flex: 1;
}

.pay-order-btn {
  background-color: #ccc; /* Серый цвет кнопки */
  color: black; /* Чёрный текст */
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Во всю ширину */
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border: none;
}

.pay-order-btn:hover {
  background-color: #bbb; /* Темнее при наведении */
}
</style>
