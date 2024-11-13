<template>
  <div class="product-page">
    <aside class="sidebar">
      <h3>Categories</h3>
      <ul>
        <li
          v-for="category in categories"
          :key="category.id"
          @click="filterByCategory(category.id)"
          :class="{active: selectedCategory === category.id}"
        >
          {{ category.name }}
        </li>
      </ul>
    </aside>

    <div class="content">
      <div class="filters">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by name..."
          @input="fetchProducts"
        />
        <select v-model="sortOrder" @change="fetchProducts">
          <option value="">Sort by price</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="product-list">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @click="goToProduct(product.id)"
        />
      </div>

      <div v-if="meta">
        <button
          @click="changePage(meta.current_page - 1)"
          :disabled="!links.prev"
        >
          Previous
        </button>
        <button
          @click="changePage(meta.current_page + 1)"
          :disabled="!links.next"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard'
import axios from 'axios'

export default {
  name: 'ProductList',
  components: {ProductCard},
  data() {
    return {
      products: [],
      categories: [],
      meta: null,
      links: null,
      selectedCategory: null,
      searchQuery: '',
      sortOrder: '',
    }
  },
  created() {
    this.fetchCategories()
    this.fetchProducts()
  },
  methods: {
    async fetchProducts(page = 1) {
      const params = {
        page,
        category_id: this.selectedCategory,
        search: this.searchQuery,
        sort: this.sortOrder,
      }

      try {
        const response = await axios.get('http://localhost/api/products', {
          params,
        })
        this.products = response.data.data
        this.meta = response.data.meta
        this.links = response.data.links
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost/api/categories')
        this.categories = response.data.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    changePage(newPage) {
      this.fetchProducts(newPage)
    },
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId
      this.fetchProducts()
    },
    goToProduct(id) {
      this.$router.push({name: 'product', params: {id}})
    },
  },
}
</script>

<style scoped>
.product-page {
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 16px;
  border-right: 1px solid #ddd;
}

.sidebar h3 {
  margin-bottom: 16px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 8px;
  cursor: pointer;
}

.sidebar li.active {
  font-weight: bold;
  color: blue;
}

.content {
  flex: 1;
  padding: 16px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* Уменьшен gap для плотного размещения */
  justify-content: space-between; /* Равномерное распределение по строке */
}
</style>
