<template>
    <v-app>
	<my-info :dialog3="myInfoDialog" v-show="false" v-on:closeMyInfo="myInfoDialog=false"></my-info>
	<my-review :dialog3="myReviewDialog" v-show="false" v-on:closeMyReview="myReviewDialog=false"></my-review>
	<div>
	<v-list-item>
		<v-list-item-content>
		<div @click="openMyInfo">
			<span class="text-h5 mb-2" style="display: inline-block;">내 정보</span>			
		</div>
		<div @click="openMyReview">
			<span class="text-h5 mb-2" style="display: inline-block;">내가 쓴 리뷰</span>			
		</div>	
		</v-list-item-content>		  
	</v-list-item>	
	</div>			
	</v-app>
</template>
<script>
import http from '@/util/http-common.js';
import MyInfo from '@/components/MyInfo.vue';
import MyReview from '@/components/MyReview.vue';
export default {
  name: 'MyPage',
  components: {
	MyInfo,
	MyReview,
  },
  data() {
    return {
		myInfoDialog: false,
		myReviewDialog: false,
    }
  },methods: {
		openMyInfo(){
			this.myInfoDialog = true;
		},
	  	openMyReview(){
			this.myReviewDialog = true;
		},
	},
};
</script>