import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import state from './store'
import wrap from '@vue/web-component-wrapper'

import './plugins/element.js'
import './plugins/axios'

import 'normalize.css'
import './assets/main.scss'

const Widjet: any = wrap(Vue, () => import('./components/weather-widget.vue'))
window.customElements.define('weather-widjets', Widjet)


Vue.use(Vuex)
const store = new Vuex.Store(state)

new Vue({
  //@ts-ignore
  store,
  render: h => h(App)
}).$mount('#app')
