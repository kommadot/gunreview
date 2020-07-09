<template>  
    <v-app id="Review">
      <v-card
		class="mx-auto"		
		tile
		flat
	  >
		<v-list-item>
		  <v-list-item-content>
			<div style="text-align:center; margin-bottom:15px;">
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
					<div style="float:left; margin-top:0.5em;font-size:1.6em"><b>{{average}}점</b></div>
					<div style="float:left">
						<v-rating						  
						  v-model="average"
						  readonly
						  half-increments
						  half-icon="mdi-star-half-full"
						  background-color="grey lighten-1"
						  color="red"
						></v-rating>
					</div>
					<div style="float:right;margin-top:1.0em;">
						<i class="fas fa-user-friends" style="color:gray"></i>	{{count}}
					</div>
				</div>
			</v-list-item-content>
		  </v-list-item>		  
		  
	  </v-card>	  
		  
	</v-card>
    </v-app>
</template>

<script>
import http from "@/util/http-common.js"
	
export default {
  name: 'PlaceReview',   
  watch: {
	  rating(){		  
		  
	  }
  },
  data() {
	return {
		info: {},
		rating: 0,
		average: 0,
		count: 0,
		title: '',
		id:0,
	}	
  },
  methods:{
	  openReviewWrite(event, value){
		  window.open(`addreview?title=${this.title}&id=${this.id}&rating=${this.rating}`);
	  }
  },
  created(){	 
	  this.id = this.$route.query.id;
	  this.title = this.$route.query.title;	  	  
	  console.dir(this.id);
	  http.get('/api/shop/' + this.id).then(({data}) => {
		  console.dir(data);
		  this.info = data;
	  })
  },    
}
</script>

<style scoped>
	#Review {
		margin-left: 0px;
		background-color: gray;
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