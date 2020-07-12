<template>
	<div style="width:100%; text-align:center;">
		<div style="height:300px;" />			
		 <a id="custom-login-btn" href="#" @click="loginWithKakao">
			 <img
				src="https://k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
				width="50%"				  
			 />
		 </a>
	  
	</div>
</template>

<script>
import axios from "axios"
export default {
	name:'Login',
	mounted() {
		Kakao.init('3c5ce7617b4b5e67265ffb2748ada137');
	},
	methods:{
		loginWithKakao(){
			
			Kakao.Auth.login({
			  success: function(response) {
				  
				  alert(JSON.stringify(response))
				console.log(response);
			  },
			  fail: function(error) {
				console.log(error);
			  },
			});
		}
	}
}
</script>