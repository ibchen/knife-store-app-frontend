import axios from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: 'http://localhost/api',
  withCredentials: true, // Включаем передачу cookies с запросом
})

// Интерцептор для автоматического добавления заголовка CSRF-токена и токена авторизации
apiClient.interceptors.request.use((config) => {
  // Добавляем CSRF-токен из cookies
  const csrfToken = Cookies.get('XSRF-TOKEN')
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken
  }

  // Добавляем токен авторизации из localStorage
  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

export default apiClient
