<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>This is the main landing page of the application.</p>
    <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
    <router-link v-else to="/customer/profile">Go to Profile</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      // Проверяем, есть ли токен в localStorage
      return !!localStorage.getItem('authToken');
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 20px;
}
</style>