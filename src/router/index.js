import Vue from 'vue'
import VueRouter from 'vue-router'
import Shop from '@/components/Shop.vue'

import PlaceReview from '@/components/PlaceReview.vue'
import PxReview from '@/components/PxReview.vue'
import AddReview from '@/components/AddReview.vue'
import Pxlist from '@/components/Pxlist.vue'
import Mypage from '@/components/MyPage.vue'
import Layout from '@/layout/Layout.vue'
import DI from '@/components/DataInput.vue'
import Login from '@/components/Login.vue'
Vue.use(VueRouter)
const routes = [
	{
		path:'/',
		name:'Main',
		component:Layout,
		children:[
			{	
				path: '/',
				name: 'Shop',
				component:Shop
			},
			{
				path: '/placereview',
				name: 'PlaceReview',
				component:PlaceReview,
			},
			{
				path: '/pxreview',
				name: 'PxReview',
				component:PxReview,
			},
			{
				path: '/addreview',
				name: 'AddReview',
				component:AddReview,
			},
			{
				path: '/pxlist',
				name: 'Pxlist',
				component:Pxlist,
			},
			{
				path: '/temp',
				name: 'temp',
				component:Pxlist,
			},
			{
				path: '/mypage',
				name: 'Mypage',
				component:Mypage,
			},
			

		]
	},
	{
		path: '/login',
		name: 'Login',
		component:Login,
	},
	{
		path: '/st',
		name: 'St',
		component:DI
	},
]

const router = new VueRouter({
	mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
