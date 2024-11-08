import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Теперь этот импорт будет работать

createApp(App).use(router).use(store).mount('#app')
