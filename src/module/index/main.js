import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import fastclick from 'fastclick';
import 'public/stylus/index.styl';

import VueLazyload from 'vue-lazyload';

fastclick.attach(document.body);

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  loading: require('public/image/default.png')
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
