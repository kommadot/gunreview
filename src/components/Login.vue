<template> 
	<v-card>
		<v-img
			   height="100%"
			   src="../assets/background.png">
				<a id="custom-login-btn" href="#" @click="loginWithKakao">
						<img   
src="https://k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
							 width=130%
						/>
				</a>
		</v-img>
		
	</v-card>
</template>

<script>
	import http from '@/util/http-common.js';
    import { mapMutations } from 'vuex';

    export default {
        name: 'Login',
        data() {
            return {
                asm: null
            };
        },
		created(){
			var pxData = []
			pxData["name"] = []
			console.dir(pxData["name"] == null)
			pxData["name"][2015+''] = []
			pxData["name"][2015+'']['a'] = 1
			pxData["name"][2015+'']['b'] = 2
			console.dir(pxData)
		},
        mounted() {
			console.dir(Kakao)
            
			
        },
        methods: {
			goShop(access_token){
				 http.get('/api/px',{headers: {
					'Authorization' : access_token,
				  }}).then(({data}) => {				  
						this.SET_PXDATA(data);			 			  
					})
				this.$router.push('/')
			},
			
            loginWithKakao() {
				var addToken = this.ADD_TOKEN
				var getAppId = this.getAppId
                Kakao.Auth.login({
                    success: function (response) {
						console.dir(response.access_token);
						addToken(response.access_token);
						getAppId(response)
                    },
                    fail: function (error) {
                        console.log(error);
                    },
                });
            },
			getAppId(response){
				
				var goShop = this.goShop;
				console.dir(response)
				var login = this.LOGIN
				var access_token = response.access_token;
				console.dir(login) 
				Kakao.Auth.setAccessToken(response.access_token)
				Kakao.API.request({
					url : "/v1/user/access_token_info",
					success: function (response) {
						console.dir(response)
						login(response.id)
						goShop(access_token)
                    },
                    fail: function (error) {
                        console.log(error);
                    },
				})
			},
            ...mapMutations(['ADD_TOKEN','LOGIN', 'SET_PXDATA']),
        },
    };
</script>

<style>
	#custom-login-btn{
		position:relative;
		top:75%;
		left:-65%
	}
</style>