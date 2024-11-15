<template>
  <div v-if="product" class="product-detail">
    <!-- Левая часть - карусель изображений -->
    <div class="product-carousel">
      <div
        class="main-image-container"
        @mouseover="showArrows = true"
        @mouseleave="showArrows = false"
      >
        <img :src="currentImage" alt="Product Image" class="main-image" />

        <!-- Стрелки навигации -->
        <button v-if="showArrows" class="arrow left" @click="prevImage">
          &lt;
        </button>
        <button v-if="showArrows" class="arrow right" @click="nextImage">
          &gt;
        </button>
      </div>

      <!-- Миниатюры изображений -->
      <div class="thumbnail-container">
        <img
          v-for="(image, index) in imageArray"
          :key="index"
          :src="`http://localhost/storage/${image}`"
          alt="Product Thumbnail"
          class="thumbnail"
          :class="{active: currentImageIndex === index}"
          @click="setCurrentImage(index)"
        />
      </div>
    </div>

    <!-- Правая часть - информация о товаре -->
    <div class="product-info">
      <h2>{{ product.name }}</h2>
      <p class="product-category">{{ product.category.name }}</p>
      <p class="product-price">${{ product.price }}</p>
      <p class="product-stock">Осталось на складе: {{ product.stock }}</p>

      <!-- Кнопка "Добавить в корзину" -->
      <button :disabled="product.stock === 0" @click="addToCart">
        Добавить в корзину
      </button>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <p class="product-description">{{ product.description }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import apiClient from '../api'

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      currentImageIndex: 0,
      showArrows: false,
      successMessage: '',
      errorMessage: '',
    }
  },
  computed: {
    imageArray() {
      // Преобразуем image_url из строки JSON в массив
      try {
        return JSON.parse(
          this.product.image_url.replace('http://localhost/storage/', '')
        )
      } catch (error) {
        console.error('Ошибка при парсинге image_url:', error)
        return []
      }
    },
    currentImage() {
      return this.imageArray.length > 0
        ? `http://localhost/storage/${this.imageArray[this.currentImageIndex]}`
        : ''
    },
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
    setCurrentImage(index) {
      this.currentImageIndex = index
    },
    nextImage() {
      if (this.currentImageIndex < this.imageArray.length - 1) {
        this.currentImageIndex++
      } else {
        this.currentImageIndex = 0
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--
      } else {
        this.currentImageIndex = this.imageArray.length - 1
      }
    },
    async addToCart() {
      try {
        await apiClient.post('/cart/add', {
          product_id: this.product.id,
          quantity: 1,
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
  display: flex;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: calc(100% - 502px);
  margin: 20px auto;
  gap: 20px;
}

.product-carousel {
  flex: 1;
  max-width: 50%;
}

.main-image-container {
  position: relative;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

.thumbnail-container {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: center;
}

.thumbnail {
  width: 60px;
  height: auto;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.thumbnail.active,
.thumbnail:hover {
  border-color: #888;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  background-color: #ccc;
  color: #333;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #bbb;
}

button:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

.product-description {
  margin-top: 16px;
  font-size: 1em;
  line-height: 1.5;
  color: #555;
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
