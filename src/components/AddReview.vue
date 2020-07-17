<template>  
    <v-app id="AddReview">
	  <v-dialog v-model="dialog2" fullscreen transition="dialog-bottom-transition">
      <v-card
		class="mx-auto"		
		tile
		flat
	  >	  
		  <v-list-item>
		  	<v-list-item-content>				
				<table>
					<tr style="text-align:center">
						<td width="15%" @click="moveReviewList(true)"><i class="fas fa-arrow-left"></i></td>
						<td width="70%" style="font-size:1.2em;">{{type != 1 ? info.place_name : info.name}}</td>
						<td width="15%" @click="addReview">등록</td>
					</tr>	
				</table>
					<div class="write_grade">
						<v-rating
						  x-large						  
						  v-model="rating"
						  hover
						  background-color="grey lighten-1"
						  color="red"								  
						></v-rating>
						<span style="20em">{{rating}} / <span style="color:gray;">5 &middot;</span> {{rating | gradeFilter}}</span>						0
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
			<input type="file"
				v-show="false"				
				id="file"
				accept="image/png, image/jpeg, image/bmp"		
				@change="changeImg"
			></input>			  
				
			<i v-show="img_path.length == 0" ref="camera" class="fas fa-camera" style="font-size:50px;" @click="clickImg($event)"></i>			
			<v-img
				:src = "'https://gunreview.ml/gunreview/resources/upload/'+img_path"
				max-width = "200px"
				max-height = "200px"
				@click="clickImg($event)"
			>
			</v-img>
			 <div style="height:100px">
				 
	</div>
			</v-list-item-content>
		  </v-list-item>
		  
	  </v-card>	
		<v-overlay :value="drawer">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
	  </v-dialog>

    </v-app>
</template>

<script>

import http from "@/util/http-common.js"
import {mapState} from "vuex";
import store from "../store/index"
	
export default {
  name: 'AddReview',  
  props:['dialog2', 'info', 'rating', 'type'],
  data() {
	return {
		nickList: ['귀여운 이등병', '성실한 일병', '엘리트 상병', '멋쟁이 병장'],
		contents: '',
		img_path: '',
		nickname: '',
		height:'300px',
		drawer:false,
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
	  changeImg(e){		
		var frm = new FormData();
		frm.append("upload_file", document.getElementById("file").files[0]);		
		http.post('/api/reviewShop/upload', frm, {
		  headers: {
			'Authorization' : store.state.access_token,
			'Content-Type': 'multipart/form-data'
		  }
		})
		.then(({data}) => {
		  console.dir(data);
		  this.img_path = data.substring(52);
			console.dir(this.img_path)
		})
		.catch((error) => {
		  // 예외 처리
		}).finally(()=>{
			this.drawer=false;
		})
	  },
	  clickImg(){
		$("#file").click();
	  },
	  moveReviewList(flag){
		if(flag){
			if(!confirm('정말로 취소하시겠습니까?')){
				return;
			}
		}
		this.contents = '';
		this.img_path = '';		
		this.$emit('writeReview');
	  },
	  addReview(){		
		  this.nickname = this.nickList[Math.floor( Math.random() * 4 )];
		  this.drawer=true;
		  console.log(store.state.user_id)
		  if(this.type == 0){
			http.post('/api/reviewShop', {
			  review_content: this.contents,
			  review_img: this.img_path,
			  review_nickname: this.nickname,
			  review_rate: this.rating,
			  review_userid: store.state.user_id,
			  shop_id: this.info.id
			},{headers: {
			'Authorization' : store.state.access_token,
		  }},).then(({data}) => {
				if(data == 'success'){
					this.moveReviewList(false);
				}
			}).finally(()=>{
			this.drawer=false;
		})
		  }
	      else if(this.type == 1){
	  		http.post('/api/reviewPX', {
	  			review_content: this.contents,
				review_img: this.img_path,
				review_nickname: this.nickname,
				review_rate: this.rating,
				review_userid: store.state.user_id,
				review_productname: this.info.name
  			},{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({data}) => {
				if(data == 'success'){
					this.moveReviewList(false);
				}
			}).finally(()=>{
			this.drawer=false;
		})
  	      }else{
			  console.dir(this.info)
			  http.post('/api/reviewWelfare', {
			  review_content: this.contents,
			  review_img: this.img_path,
			  review_nickname: this.nickname,
			  review_rate: this.rating,
			  review_userid: store.state.user_id,
			  welfare_id: this.info.id
			},{headers: {
			'Authorization' : store.state.access_token,
		  }},).then(({data}) => {
				if(data == 'success'){
					this.moveReviewList(false);
				}
			}).finally(()=>{
			this.drawer=false;
		})
		  }
	  }
  },
  created(){	   
	  
	  console.dir(store.state.access_token);
  },
  mounted(){		
	 //this.height = window.innerHeight - this.$refs.contents.$el.offsetTop - 200 + 'px';
  },
	computed:{
		...mapState(["user_id"])
	}
}
</script>

<style scoped>
	a {
		text-decoration:none;
	}
	
	#AddReview {
		margin-left: 0px;
	}
	.write_grade{		
		text-align:center;
		margin-top:5px;
		
		padding-bottom:20px;
		border-bottom:1px solid #f2f2f2;
	}
	
</style>