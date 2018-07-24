// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import '@/common/js/hack'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import  VueLazyload from 'vue-lazyload'
import store from './store'
import '@/common/scss/index.scss'

/* eslint-disable no-unused-vars */
// import vConsole from  'vconsole'

Vue.use(VueLazyload,{
  error:'/static/img/default.png',
  loading:'/static/img/default.png',
})
Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
