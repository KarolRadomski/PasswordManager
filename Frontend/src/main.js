import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/js/bootstrap.js';

import App from './App.vue';
import router from './router';
const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app');
