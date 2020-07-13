<template>
    <v-app>
    <div>
		내 정보
	</div>
	<div>
		내가 쓴 리뷰
	</div>
	</v-app>
</template>
<script>
import http from '@/util/http-common.js';
export default {
  data() {
    return {
		pxreviewList: [],
		shopreviewList: [],
		welfarereviewList: [],
    }
  },
  created() {
	 // http.get('/api/px/' + this.year +'/{month}?month='+ this.month).then(({data}) => {
	 // console.dir(data);
	 // if(data.length != 0) {
	 // this.reviewList = data;
	 // }
	 //  })  
  },
	methods: {
		// increment: function() {
		// // 함수 
		// },
  },
};
</script>
<style scoped>
	
</style>


