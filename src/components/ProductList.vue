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
          class="filter-input"
        />
        <select
          v-model="sortOrder"
          @change="fetchProducts"
          class="filter-select"
        >
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

      <div v-if="meta && meta.total > meta.per_page" class="pagination">
        <button
          @click="changePage(meta.current_page - 1)"
          :disabled="meta.current_page === 1"
          class="pagination-arrow"
        >
          &lt;
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="{active: meta.current_page === page}"
          class="pagination-page"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(meta.current_page + 1)"
          :disabled="meta.current_page === meta.last_page"
          class="pagination-arrow"
        >
          &gt;
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
      selectedCategory: null,
      searchQuery: '',
      sortOrder: '',
    }
  },
  computed: {
    displayedPages() {
      const total = this.meta.last_page
      const current = this.meta.current_page
      const pages = []

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        if (current <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', total)
        } else if (current >= total - 3) {
          pages.push(
            1,
            '...',
            total - 4,
            total - 3,
            total - 2,
            total - 1,
            total
          )
        } else {
          pages.push(1, '...', current - 1, current, current + 1, '...', total)
        }
      }
      return pages
    },
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
      if (newPage !== '...') {
        this.fetchProducts(newPage)
      }
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

.filter-input,
.filter-select {
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}

/* Стили для пагинации */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
}

.pagination-page,
.pagination-arrow {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  font-weight: bold;
}

.pagination-page.active,
.pagination-page:hover,
.pagination-arrow:hover {
  background-color: #007bff;
  color: white;
}

.pagination-page:disabled,
.pagination-arrow:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
