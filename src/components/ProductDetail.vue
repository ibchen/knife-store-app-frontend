<template>
  <div v-if="product" class="product-detail">
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <p>Category: {{ product.category.name }}</p>
    <p>Price: ${{ product.price }}</p>
    <p>In Stock: {{ product.stock }}</p>

    <!-- Кнопка для добавления товара в корзину -->
    <button @click="addToCart">Add to Cart</button>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import apiClient from '../api' // Импортируем API клиент

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      successMessage: '',
      errorMessage: '',
    }
  },
  async created() {
    const productId = this.$route.params.id
    await this.fetchProduct(productId)
  },
  methods: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`http://localhost/api/products/${id}`)
        this.product = response.data.data
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    async addToCart() {
      try {
        await apiClient.post('/cart/add', {
          product_id: this.product.id,
          quantity: 1, // Количество по умолчанию - 1
        })
        this.successMessage = 'Product added to cart!'
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = 'Failed to add product to cart'
        console.error('Error adding to cart:', error)
        this.successMessage = ''
      }
    },
  },
}
</script>

<style scoped>
.product-detail {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #218838;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
