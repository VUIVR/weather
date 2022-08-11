import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './plugins/element.js'
import './plugins/axios'

import 'normalize.css'
import './assets/main.scss'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
