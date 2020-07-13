<template>  
    <v-app id="Review">
		<add-review v-show="false" :dialog2="dialog2" :info="info" :rating="rating" type="0" v-on:writeReview="getReviewList"></add-review>
		<v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
      <v-card
		class="mx-auto"		
		tile
		flat
	  >
		<v-list-item>
		  <v-list-item-content>			
			<div style="text-align:center; margin-bottom:15px;">
				<div style="float:left">					
					<i class="fas fa-arrow-left" @click="closeReview"></i>
				</div>
				<span class="text-h5 mb-2" style="display: inline-block;">{{info.place_name}}</span>				 
				<span class="grey--text mb-2"> {{info.category_group_name}} </span>
			</div>
			<div class="place_nav">	
				<div class="nav_btn">
					<span style="display:block;"><i class="fas fa-phone-alt" style="font-size:20px"></i></span>
					<span style="display:block; margin-top:10px">전화</span>
				</div>
				
				<div class="nav_btn">
					<span style="display:block;"><i class="fas fa-map-marker-alt" style="font-size:20px"></i></span>
					<span style="display:block; margin-top:10px">지도</span>
				</div>
				
				<div class="nav_btn">
					<span style="display:block;"><i class="far fa-bookmark" style="font-size:20px"></i></span>
					<span style="display:block; margin-top:10px">저장하기</span>
				</div>
				
				<div class="nav_btn" style="border-right:none">
					<span style="display:block;"><i class="fas fa-share-square" style="font-size:20px"></i></span>
					<span style="display:block; margin-top:10px">공유</span>
				</div>
			</div>
			
			<div class="place_info">
				<span class="info_elmt"><i class="fas fa-map-marker-alt" style="margin-right:10px"></i> {{info.road_address_name}}</span>
				<span class="info_elmt"><i class="far fa-clock" style="margin-right:10px"></i> 영업시간</span>
				<span class="info_elmt"><i class="fas fa-phone-alt" style="margin-right:10px"></i> {{info.phone}}</span>								
			</div>
			  
		  </v-list-item-content>		  
		</v-list-item>
		  <div style="width:100%;height:10px; background-color: #f2f2f2;" />
		  <v-list-item>
		  	<v-list-item-content>
				<div class="review_add">
					평가하기
					<div class="write_grade">
						<v-rating
						  x-large						  
						  v-model="rating"
						  hover
						  @input="openReviewWrite($event, rating)"
						  background-color="grey lighten-1"
						  color="red"
								  
						></v-rating>
					</div>
				</div>
			</v-list-item-content>
		  </v-list-item>
		  <div style="width:100%;height:10px; background-color: #f2f2f2;" />		  
		  <v-list-item>
		  	<v-list-item-content>
				<div style="text-align:left;">
					<div style="float:left; margin-top:0.5em;font-size:1.3em"><b>{{average}}점</b></div>
					<div style="float:left">
						<v-rating						  
						  v-model="average"
						  readonly
						  dense
						  large
						  half-increments
						  half-icon="mdi-star-half-full"
						  background-color="grey lighten-1"
						  color="red"
						></v-rating>
					</div>
					<div style="float:right;margin-top:1.0em;">
						<i class="fas fa-user-friends" style="color:gray"></i>	{{info.review_num}}
					</div>
				</div>
				<v-card tile flat>
				  <v-list three-line>
					<v-list-item v-if="reviewList.length == 0">
						<v-list-item><div style="width:100%; text-align:center">등록된 리뷰가 없습니다.</div></v-list-item>
					</v-list-item>
					<template v-for="(review, index) in reviewList">					  
					  <v-list-item :key="review.no + '_item'" @click="">
						<v-list-item-avatar>
						  <img src="people.jpg">
						</v-list-item-avatar>
						<v-list-item-content>
						  <v-list-item-title >
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
							  <span class='text--primary' style="font-size:1.0em;">{{review.review_nickname}}</span> &#124; {{review.review_datetime.substring(0,10)}}
						  </v-list-item-subtitle>
						  <div style="height:5px"></div>						  
							<v-img
							  :src = "'https://gunreview.ml/gunreview/resources/upload/'+review.review_img"
							  max-height="100px"
							  max-width="100px"
							></v-img>
							<div style="height:10px"></div>			
							<v-list-item-subtitle><span class='text--primary' style="font-size:1.0em;">{{review.review_content}}</span></v-list-item-subtitle>
						</v-list-item-content>
					  </v-list-item>
					  <v-divider :key="index + '_divider'" :inset="true"></v-divider>
					</template>
				  </v-list>
				</v-card>
			</v-list-item-content>
		  </v-list-item>		  		  
	  </v-card>	  
	  <!-- <div style="height:100px;"></div> -->
	</v-dialog>
    </v-app>
</template>

<script>
import http from "@/util/http-common.js"
import AddReview from "@/components/AddReview.vue"
	
export default {
  name: 'PlaceReview',   
  props: ['dialog', 'info'],
  components:{
	  AddReview,
  },
  watch: {
	  dialog(){		  
		if(this.dialog == true){
			console.dir(this.info.id)
			this.getReviewList();
		}
	  }
  },
  data() {
	return {
		reviewList: [],
		rating: 0,
		average: 0,
		dialog2: false,
	}	
  },
  methods:{
	  closeReview(){
		this.$emit('closeReview');
	  },
	  openReviewWrite(event, value){
		  this.dialog2 = true;
	  },
	  getReviewList(){
		  this.dialog2 = false;
		  http.get('/api/reviewShop/' + this.info.id).then(({data}) => {				  
				this.reviewList = data;
				if(this.info.review_num == 0){
					this.average = 0;
				}else{
					this.average = (this.info.sum_rate/this.info.review_num).toFixed(1);
				}				 			  
			})
	  }
  },
  created(){	
	  
  },    
}
</script>

<style scoped>
	#Review {
		margin-left: 0px;
	}
	span {
		font-size:0.8em;
	}
	
	.place_nav {
		text-align:center; 
		padding:15px 0px; 
		border-top:1px solid #f2f2f2; 
		border-bottom:1px solid #f2f2f2;		
	}
	
	.nav_btn {
		display:inline-block; 
		width:25%; 
		border-right:1px solid #f2f2f2
	}
	
	.nav_btn:hover{
		opacity:0.4;			
	}
	
	.place_info{
		margin-top:30px;
	}
	
	.info_elmt {
		display:block;
		padding:15px 0px; 		
		border-bottom:1px solid #f2f2f2;		
	}
	
	.review_add {
		width:100%; 
		text-align:center;
	}
	
	.write_grade{		
		margin-top:5px;
	}
</style>