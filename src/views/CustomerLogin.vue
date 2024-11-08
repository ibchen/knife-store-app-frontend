<template>
  <div>
    <h2>Welcome to your Profile</h2>
    <p>This is your personal profile page.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import apiClient from '../api';

export default {
  name: 'CustomerProfile',
  methods: {
    async logout() {
      try {
        await apiClient.post('/customer/logout', null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        localStorage.removeItem('authToken');
        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
}
</style>