import Vue from 'vue'
import App from './app'
import './styles.sass'

/* eslint-disable no-new */
new Vue({
  el: '#App',
  components: { App },
  template: '<App/>'
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
