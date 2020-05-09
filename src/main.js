import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'normalize.css/normalize.css'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import './icons'
import store from './store'
import './permission'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
