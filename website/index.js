import Vue from 'vue'
import App from './app'

/* eslint-disable no-new */
new Vue({
  el: '#App',
  components: { App },
  template: '<App/>'
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
