<template>  
    <v-app id="Review">	
	  <add-review v-show="false" :dialog2="dialog2" :info="info" :rating="rating" type="1" v-on:writeReview="getReviewList"></add-review>
	  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
      <v-card
		class="mx-auto"		
		tile
		flat
	  >
		<v-list-item>
		  <v-list-item-content>
			<div style="text-align:center; margin-bottom:15px;">
				<div style="float:left; margin-top:0.5em">
					<i class="fas fa-arrow-left" @click="closeReview"></i>
				</div>
				<span class="text-h5 mb-2" style="display: inline-block;">{{info.name}}</span>			
			</div>			
			
			<div class="place_info">
				<span class="info_elmt"><i class="fas fa-won-sign" style="float:left;"></i> 
					
					<div style="width:50%; float:left; margin:0px 10px;">
						<span v-show="!editPrice">{{info.price | addComma}}원 </span>
						<v-text-field v-model="info.price" :rules="rules" v-show="editPrice" dense height="1.0em" @keydown.enter="validation">
						</v-text-field>
					</div>
					<i class="far fa-edit" @click="validation"></i> 
				</span>
				<span class="info_elmt">상세 정보 <i class="far fa-edit" @click="updateDetail"></i> </span>	
				<div style="height:10px" />
				<span v-show="!editDetail" v-html="c_detail" style="margin-left:10px"></span>
				<v-textarea v-model="info.detail" v-show="editDetail" dense outlined auto-grow></v-textarea>				
			</div>
		  </v-list-item-content>		  
		</v-list-item>
		  
		  <div style="width:100%;height:10px; background-color: #f2f2f2;" />
		  <v-list-item>
		  	<v-list-item-content>
				<span class="info_elmt"> 연도별 순위 </span>	
				<v-sparkline
				  :labels="lineLables"
				  :value="lineValue"
				  color="#42b3f4"
				  line-width="2"
				  padding="16"
				  label-size="12"
				></v-sparkline>
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
						<v-list-item><div style="width:100%; text-align:center; ">등록된 리뷰가 없습니다.</div></v-list-item>
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
	  </v-dialog>
    </v-app>
</template>

<script>
import http from "@/util/http-common.js"
import AddReview from "@/components/AddReview.vue"
import store from "../store/index"
	
String.prototype.replaceAll = function (org, dest) {
        return this.split(org).join(dest);
};
export default {
  name: 'PxReview',     
  props: ['dialog', 'info'],
  components:{
	  AddReview,
  },
  watch: {
	  dialog(){		  
		if(this.dialog == true){
			console.dir(this.lineValue);
			this.lineValue = [1,5,6,4,2,1];
			for(let i = 0; i <= 5; i++){
				console.dir()
				if(!store.state.pxData[this.info.name] || !store.state.pxData[this.info.name][2015+i+''] || !store.state.pxData[this.info.name][2015+i+'']['rank']){
					this.lineValue[i] = 21;
				}else{
				this.lineValue[i] = (store.state.pxData[this.info.name][2015+i+'']['rank'] + 21* (store.state.total[2015+i+''] - 										store.state.pxData[this.info.name][2015+i+'']['cnt'])) / store.state.total[2015+i+''];
				}
			}
			console.dir(this.lineValue);
			this.getReviewList();
		}
	  },
  },
  filters: {
	  addComma(x){
		  if(x){
			  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		  }
	  }  
  },	
  data() {
	return {
		dialog2:false,
		
		reviewList: [],
		rating: 0,
		average: 0,
		id:0,
		price:'0',
		detail:'',
		
		editPrice: false,
		editDetail: false,
		
		rules: [
			value => !(value.length == 0 || value[0] == '0') || '0으로 시작할 수 없습니다.',
			value => (value || '').length <= 6 || '최대 6자까지 입력 가능합니다.',
			value => {
			  const pattern = /^[0-9]*$/
			  return pattern.test(value) || '숫자만 입력해 주세요'
        },
      ],
		
			
		lineValue : [1,2,3,4,5,6],
		lineLables : [2015,2016,2017,2018,2019,2020]
	}	
  },
  computed: {
	c_detail(){
		if(this.info.detail)
			return this.info.detail.replaceAll("\n", "<br>");
		else
			return "상세정보가 없습니다.";
	}
  },
  methods:{
	  updatePrice(){
		  this.editPrice = !this.editPrice;
		  if(!this.editPrice){
			  http.put(`/api/infoProduct/price/${this.info.name}/${this.info.price}`,{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({data}) => {
				  console.dir(data);
			  })
		  }
	  },
	  updateDetail(){
		  this.editDetail = !this.editDetail;
		  if(!this.editDetail){
			  http.put(`/api/infoProduct/detail/${this.info.name}/${this.info.detail}`,{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({data}) => {
				  console.dir(data);
			  })
		  }
	  },
	  closeReview(){
		this.$emit('closeReview');
	  },
	  openReviewWrite(event, value){
		  this.dialog2 = true;
	  },
	  getReviewList(){
		  this.dialog2 = false;
		  http.get('/api/reviewPX/all/' + this.info.name,{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({data}) => {				  			
			  console.dir(data)
				this.reviewList = data;
				if(this.info.review_num){
					this.average = (this.info.sum_rate/this.info.review_num).toFixed(1);					  	
				}else{
					this.average = 0;
				}				  
			  
			})
		  
		  
	  },
	  validation(){
		  console.log(this.info.price)
		  if(this.editPrice){
		  	const pattern = /^[0-9]*$/
		  	if(this.info.price.length !== 0 && this.info.price[0] !== '0' && this.info.price.length<=6 && pattern.test(this.info.price)){
				this.updatePrice()
				this.editPrice = false;
		  	}
		  }else{
			  this.editPrice = true;
		  }
			
	  }
  },
  created(){	 
	  console.dir(this.dialog);
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
		font-size:1.2em;
	}
	
	.review_add {
		width:100%; 
		text-align:center;
	}
	
	.write_grade{		
		margin-top:5px;
	}
</style>