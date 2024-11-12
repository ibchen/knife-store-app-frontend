<template>
  <div>
    <h2>Customer Profile</h2>

    <!-- Данные профиля -->
    <div class="profile-info">
      <div>
        <label>Name:</label>
        <input type="text" v-model="userProfile.name" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="userProfile.email" />
      </div>
    </div>

    <h3>Delivery Addresses</h3>
    <div
      v-for="(address, index) in userProfile.addresses"
      :key="address.id"
      class="address-info"
    >
      <h4>Address {{ index + 1 }}</h4>
      <div>
        <label>Country:</label>
        <input type="text" v-model="address.country" />
      </div>
      <div>
        <label>City:</label>
        <input type="text" v-model="address.city" />
      </div>
      <div>
        <label>Street:</label>
        <input type="text" v-model="address.street" />
      </div>
      <div>
        <label>House:</label>
        <input type="text" v-model="address.house" />
      </div>
      <div>
        <label>Apartment:</label>
        <input type="text" v-model="address.apartment" />
      </div>
      <div>
        <label>Postal Code:</label>
        <input type="text" v-model="address.postal_code" />
      </div>
    </div>

    <button @click="saveChanges">Save Changes</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
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
        addresses: [],
      },
      errorMessage: '',
      successMessage: '',
    }
  },
  created() {
    this.fetchUserProfile()
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await apiClient.get('/customer/profile')
        this.userProfile = response.data.data
      } catch (error) {
        this.errorMessage = 'Failed to load profile data.'
        console.error('Error fetching profile:', error)
      }
    },
    async saveChanges() {
      try {
        const response = await apiClient.put(
          '/customer/profile',
          this.userProfile
        )
        this.successMessage = 'Profile updated successfully.'
      } catch (error) {
        this.errorMessage = 'Failed to save changes.'
        console.error('Error saving profile:', error)
      }
    },
  },
}
</script>

<style scoped>
.profile-info,
.address-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
