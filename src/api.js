import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost/api', // Базовый URL вашего API
  withCredentials: true, // Требуется для работы с Sanctum
})

export default apiClient
