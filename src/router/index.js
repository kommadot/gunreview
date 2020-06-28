import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/Index.vue'
import Shop from '@/components/Shop.vue'
Vue.use(VueRouter)
const routes = [
	{
	path: '/',
	name: 'Index',
	component: Index
	},
	{
		path: '/shop',
		name: 'Shop',
		component:Shop
	},
	  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
