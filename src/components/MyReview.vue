<template>  
    <v-app id="MyReview">	
	  <v-dialog v-model="dialog3" fullscreen transition="dialog-bottom-transition">
		  <v-card class="mx-auto" tile flat>
			<div style="float:left; margin-top:0.5em">
				<i class="fas fa-arrow-left" @click="closeMyReview"></i>
			</div>
			<div>
				내 리뷰 리스트 받아오기
			</div> 
		</v-card>
	  </v-dialog>
    </v-app>
</template>

<script>
import http from "@/util/http-common.js"
export default {
  name: 'MyReview',     
  props: ['dialog3'],
  created(){	 
	  console.dir(this.dialog3);
  },
  methods:{
	  closeMyReview(){
		this.$emit('closeMyReview');
	  },
  },
}
</script>