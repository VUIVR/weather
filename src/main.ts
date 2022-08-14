import Vue from 'vue'
import App from './App.vue'
import wrap from '@vue/web-component-wrapper'
import WeatherWidjet from './components/weather-widget.vue'

import './plugins/element.js'
import './plugins/axios'

import 'normalize.css'
import './assets/main.scss'

const Widjet: any = wrap(Vue, () => import('./components/weather-widget.vue'))
window.customElements.define('weather-widjets', Widjet)

/* new Vue({
  render: h => h(App)
}).$mount('#app') */
