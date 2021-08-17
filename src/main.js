import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import money from 'v-money'

createApp(App).use(store).use(router).use(money, { precision: 4 }).mount('#app')
router.push({ path: "home" });