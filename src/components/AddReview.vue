<template>  
    <v-app id="AddReview">
		
      <v-card
		class="mx-auto"		
		tile
		flat
	  >	  
		  <v-list-item>
		  	<v-list-item-content>
				<div class="reviewTitle">
					<a href="#" style="color:#000000; float:left" @click="moveReviewList(true)">취소</a>					
					<a href="#" style="float:right" @click="addReview">등록</a>
					<div style="position:absolute; font-size:1.2em;text-align:center; width:100%">{{title}}</div>
				</div>				
					<div class="write_grade">
						<v-rating
						  x-large						  
						  v-model="rating"
						  hover
						  background-color="grey lighten-1"
						  color="red"								  
						></v-rating>
						<span style="20em">{{rating}} / <span style="color:gray;">5 &middot;</span> {{rating | gradeFilter}}</span>						
					</div>
					
			  <v-textarea    
				ref="contents"
          		auto-grow
				rows=1
          		:row-height="height"
				rounded
				placeholder="이 장소의 어떤점이 마음에 드셨나요?"
				v-model="contents"
        ></v-textarea>
			<i ref="camera" class="fas fa-camera" style="font-size:50px;"></i>			
			</v-list-item-content>
		  </v-list-item>
		  
	  </v-card>	  		  
    </v-app>
</template>

<script>

import http from "@/util/http-common.js"
	
export default {
  name: 'AddReview',  
  data() {
	return {
		nickList: ['귀여운 이등병', '성실한 일병', '엘리트 상병', '멋쟁이 병장'],
		id:0,
		rating:0,
		title:'',		
		contents: '',
		height:'300px',
		tmp:'50px',
	}	
  },
  filters: {
	  gradeFilter(grade) {
		if (grade == 0) return '평가해주세요'
		else if (grade == 1) return '별로예요'
		else if (grade == 2) return '조금 아쉬워요'
		else if (grade == 3) return '보통이에요'
		else if (grade == 4) return '좋아요'
		else return '최고예요'
	   }
  },
  methods:{
	  moveReviewList(flag){
		if(flag){
			if(!confirm('정말로 취소하시겠습니까?')){
				return;
			}
		}else{
			alert("등록이 완료되었습니다");			
		}
		this.$router.push(`/placereview?title=${this.title}&id=${this.id}`);  
	  },
	  addReview(){		  
		http.post('/api/reviewShop', {
		  review_content: this.contents,
		  review_img: '',
		  review_nickname: this.nickList[Math.floor( Math.random() * 4 )],
		  review_rate: this.rating,
		  review_userid: '',
		  shop_id: this.id
		}).then(({data}) => {
			if(data == 'success'){
				this.moveReviewList(false);
			}
		})
	  }
  },
  created(){	 
	  this.id = this.$route.query.id;
	  this.rating = parseInt(this.$route.query.rating);
	  this.title = this.$route.query.title;	  
	  
  },
	mounted(){		
		this.height = window.innerHeight - this.$refs.contents.$el.offsetTop -120 + 'px';
	}
	
}
</script>

<style scoped>
	a {
		text-decoration:none;
	}
	
	#AddReview {
		margin-left: 0px;
		background-color: gray;
	}
	.write_grade{		
		text-align:center;
		margin-top:5px;
		
		padding-bottom:20px;
		border-bottom:1px solid #f2f2f2;
	}
	
</style>