<template>
  <div class="product-card" @click="$emit('click')">
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p>Category: {{ product.category.name }}</p>
    <p>Price: ${{ product.price }}</p>
    <p>In Stock: {{ product.stock }}</p>
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
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.02);
}
</style>
