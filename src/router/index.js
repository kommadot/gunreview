import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/Index.vue'
import Shop from '@/components/Shop.vue'
import ShopTestList from '@/components/ShopTestList.vue'
import Test from '@/components/Test.vue'
import PlaceReview from '@/components/PlaceReview.vue'
import AddReview from '@/components/AddReview.vue'
import Pxlist from '@/components/Pxlist.vue'

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
	{
		path: '/test',
		name: 'Test',
		component:Test,
	},
	{
		path: '/placereview',
		name: 'PlaceReview',
		component:PlaceReview,
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
		path: '/shoptest',
		name: 'ShopTestList',
		component:ShopTestList
	},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
