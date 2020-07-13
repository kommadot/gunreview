import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
// import VueOnsen from 'vue-onsenui';
import vuetify from './plugins/vuetify';
import '../node_modules/vuetify/dist/vuetify.min.css'
Vue.config.productionTip = false
//Vue.use(VueOnsen);
new Vue({
  router,
  store,
  vuetify,
  render: h => h('router-view')
}).$mount('#app')
