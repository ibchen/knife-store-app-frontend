<template>
  <div class="product-card">
    <h3 @click="goToProduct">{{ product.name }}</h3>
    <!-- Клик только на заголовке -->
    <p>{{ product.description }}</p>
    <p>Category: {{ product.category.name }}</p>
    <p>Price: ${{ product.price }}</p>
    <p>In Stock: {{ product.stock }}</p>

    <!-- Кнопка "Add to Cart" с модификатором .stop -->
    <button @click.stop="addToCart">Add to Cart</button>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import apiClient from '../api' // Импорт клиента API

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      successMessage: '',
      errorMessage: '',
    }
  },
  methods: {
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
    goToProduct() {
      this.$emit('click') // Событие клика для перехода на страницу продукта
    },
  },
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.02);
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
