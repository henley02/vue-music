import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick';

fastclick.attach(document.body);

Vue.config.productionTip = false
import 'public/stylus/base.styl';

new Vue({
  render: h => h(App)
}).$mount('#app');
