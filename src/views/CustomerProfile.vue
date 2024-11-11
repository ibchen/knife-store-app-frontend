<template>
  <div>
    <h2>Customer Profile</h2>

    <!-- Данные профиля -->
    <div class="profile-info">
      <div>
        <label>Name:</label>
        <span>{{ userProfile.name }}</span>
      </div>
      <div>
        <label>Email:</label>
        <span>{{ userProfile.email }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'CustomerProfile',
  data() {
    return {
      userProfile: {
        name: '',
        email: '',
      },
      errorMessage: '',
    }
  },
  created() {
    this.fetchUserProfile()
  },
  methods: {
    // Метод для получения данных профиля
    async fetchUserProfile() {
      try {
        const response = await apiClient.get('/customer/profile')
        this.userProfile = response.data.data
      } catch (error) {
        this.errorMessage = 'Failed to load profile data.'
        console.error('Error fetching profile:', error)
      }
    },
  },
}
</script>

<style scoped>
.profile-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info div {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
