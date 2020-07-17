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
  render: h => h('router-view'),
  created(){
	   document.title = "출격! 리뷰소대";
	console.dir('created')    
	Kakao.init('3c5ce7617b4b5e67265ffb2748ada137');
	  if(!store.state.user_id){
				this.$router.push('/login');	
			}
  },
  watch: {
	  $route(to){
		if(to.path != '/login'){
			console.dir(store.state.access_token)
			if(store.state.access_token.length == 0){
				this.$router.push('/login');	
			}
			
		}
	  }
  }
}).$mount('#app')
