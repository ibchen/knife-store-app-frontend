<template>
  <div v-if="product" class="product-detail">
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <p>Category: {{ product.category.name }}</p>
    <p>Price: ${{ product.price }}</p>
    <p>In Stock: {{ product.stock }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
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
</style>
