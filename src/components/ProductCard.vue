<template>
  <div class="product-card" @click="goToProduct">
    <img :src="previewImage" alt="Product Image" class="product-image" />
    <h3>{{ product.name }}</h3>
    <p class="product-category">{{ product.category.name }}</p>
    <p class="product-price">${{ product.price }}</p>
    <p class="product-stock">Осталось на складе: {{ product.stock }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    previewImage() {
      // Преобразуем image_url из строки JSON в массив и возвращаем первый элемент
      try {
        const images = JSON.parse(
          this.product.image_url.replace('http://localhost/storage/', '')
        )
        return images.length > 0 ? `http://localhost/storage/${images[0]}` : ''
      } catch (error) {
        console.error('Ошибка при парсинге image_url:', error)
        return '' // Если ошибка, возвращаем пустую строку
      }
    },
  },
  methods: {
    goToProduct() {
      this.$emit('click') // Событие клика для перехода на страницу продукта
    },
  },
}
</script>

<style scoped>
.product-card {
  width: 28%;
  border: 1px solid #ddd;
  padding: 8px;
  margin: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 6px;
}

h3 {
  font-size: 1.1em;
  margin-bottom: 6px;
}

.product-category,
.product-price,
.product-stock {
  font-size: 0.9em;
  margin: 4px 0;
}

.product-price {
  font-weight: bold;
  color: #333;
}

.product-stock {
  color: #888;
}
</style>
