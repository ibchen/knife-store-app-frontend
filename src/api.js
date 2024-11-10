import axios from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: 'http://localhost/api',
  withCredentials: true,
  headers: {
    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Включаем токен вручную
  },
})

// Добавляем интерцептор для автоматического добавления токена в заголовок Authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
