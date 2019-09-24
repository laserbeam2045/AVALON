import Vue from 'vue'
import store from './store/index'
import App from './components/App.vue'

Vue.config.productionTip = true

new Vue({
  store,
  render: h => h(App),
}).$mount('#root')