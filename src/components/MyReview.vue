<template>  
    <v-app id="MyReview">	
	  <v-dialog v-model="dialog3" fullscreen transition="dialog-bottom-transition">
	  <!-- <v-dialog v-model="dialog3" fullscreen transition="slide-y-reverse-transition"> -->
	  <!-- <v-dialog v-model="dialog3" fullscreen transition="fab-transition"> -->
		  <v-card class="mx-auto" tile flat>
			<div>
				<v-app-bar color="#587850" dense dark>
                <v-toolbar-title style="margin-left: auto; margin-right: auto;">
                    <div>내 리뷰</div>
                </v-toolbar-title>
				  <v-btn style="right:10px;position:absolute;" @click="closeMyReview" icon >
					<v-icon>fa fa-close</v-icon>
				  </v-btn>	
				</v-app-bar>
			</div>  
			  
			<!-- <div style="float:left;">
				<i class="fas fa-arrow-left" @click="closeMyReview"></i>
			</div> -->
			<!-- 드랍다운해서 리스트 3개중에 원하는거 선택 가능하게 하기 -->
			<!-- <v-container id="dropdown-example">
				<v-row>
				  <v-col cols="12" sm="4">
					<p>Overflow</p>

					<v-overflow-btn
					  class="my-2"
					  :items="dropdown_font"
					  label="Overflow Btn"
					  target="#dropdown-example"
					></v-overflow-btn>
				  </v-col>
				</v-row>
			  </v-container> -->
			  <v-tabs color="#d8345f":centered="true" :grow="true" :icons-and-text="true">
				<v-tab @click="changeOption(0)">
					MAP
					<v-icon>fas fa-map-marked-alt</v-icon>
				</v-tab>
				<v-tab @click="changeOption(1)">
					복지시설
					<v-icon>far fa-id-card</v-icon>
				</v-tab>
				<v-tab @click="changeOption(2)"> 
					PX 
        			<v-icon>mdi-shopping</v-icon>
				</v-tab>
			  </v-tabs>
			  
			  <v-list>
				<!-- <v-subheader v-on:click="showOtherReview">내가 쓴 리뷰(클릭하면 항목 바뀜)</v-subheader> -->
				<!-- <button ><i class='fas fa-dog'></i></button>	 -->
				<template v-for="(review, index) in reviewList">
					<v-list-item> 
					<v-list-item-avatar tile>
							<v-img
							  :src = "'https://gunreview.ml/gunreview/resources/upload/'+review.review_img"
							  max-height="50px"
							  max-width="50px"></v-img>
					</v-list-item-avatar>
					<v-list-item-content>
						
						 <v-list-item-title >
							<div v-if="showoption==2">
								<div><div id="review_productname" class="font-weight-bold">{{review.review_productname}}</div>
									<span style="float:right;"><i class="fas fa-trash-alt" @click="deleteThisReview(review.no)"></i></span></div>
							</div>
							<div v-else>
								<div><div id="review_productname" class="font-weight-bold" >{{review.place_name}}</div>
									<span style="float:right;"><i class="fas fa-trash-alt" @click="deleteThisReview(review.no)"></i></span></div>
							<!-- <button v-on:click="getItemName(review.shop_id)">
								누르면 상품명 나옴
							</button>		
								<div>{{nameofproduct.place_name}}<span style="float:right;"><i class="fas fa-trash-alt" @click="deleteThisReview(review.no)"></i></span></div> -->
							</div>
							 <v-rating						  
							  v-model="review.review_rate"
							  readonly
							  small
							  dense
							  background-color="grey lighten-1"
							  color="red"
							></v-rating>
						  </v-list-item-title>
						  <v-list-item-subtitle>
							<div>
							  <span class='text--primary' style="font-size:1.0em;">{{review.review_nickname}} </span>&#124; {{review.review_datetime.substring(0,10)}}
							</div>  
							  <div class='text--primary' style="font-size:1.0em;">{{review.review_content}}</div>
						  </v-list-item-subtitle>
					</v-list-item-content>
					</v-list-item>
				<v-divider :key="index + '_divider'" ></v-divider>
				</template>
			</v-list> 
		</v-card>
	  </v-dialog>
    </v-app>
</template>

<script>
import http from "@/util/http-common.js"
import store from "../store/index";
export default {
	name: 'MyReview',     
	props: ['dialog3'],
	data() {
	return {
		showoption: 0,
		reviewList: [],
		reviewtypes: [{num:"0",shownname:"map리뷰"}
					  ,{num:"1",shownname:"복지시설리뷰"}
					  ,{num:"2",shownname:"px리뷰"}],
		reviewtypeurl: ["reviewShop","reviewWelfare","reviewPX"],
		id: store.state.user_id,
		nameofproduct:"",
		dropdown_font: ['map리뷰', '복지시설리뷰', 'px리뷰'],
	}
	},
	created(){	 
	  this.getReviewList(this.showoption);
	},
	methods:{
		closeMyReview(){
		this.$emit('closeMyReview');
		},
		// showOtherReview: function() {	
		// 	this.showoption=(this.showoption+1)%3;
		// 	this.getReviewList(this.showoption);
		// },
		getReviewList(showoption){
	 		//alert(this.reviewtypeurl[showoption]);
			http.get('/api/'+this.reviewtypeurl[showoption]+'/myreview/' + this.id).then(({data}) => {
				console.dir(data);
				console.dir(data);
				if(data.length != 0) {
				  this.reviewList = data;
				}else{
					 this.reviewList = null;
				}
			})
		},
		changeOption: function(num){
			this.showoption=num;
			this.getReviewList(this.showoption);
		},
		deleteThisReview: function(input) {
			//alert(input);
			http.delete('/api/'+this.reviewtypeurl[this.showoption]+'/' + input).then(({data}) => {
				console.dir(input+"삭제됨");
				this.getReviewList(this.showoption);
			})
		},
		getItemName: function(shopid) {
			if(this.showoption==0){
				alert(shopid);
				http.get('/api/shop/'+ shopid).then(({data}) => {
				console.dir(shopid+" 찾아옴, 결과 : " + data);
				this.nameofproduct=data;
				})
			}else{
				this.nameofproduct="아무개";								
			}

		},

	},
}
</script>

<style scoped>
	
	.font-weight-bold{
		font-sizes : 30px;
	}
</style>