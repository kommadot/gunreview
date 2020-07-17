<template>
<v-app>
   <my-info :dialog3="myInfoDialog" v-show="false" v-on:closeMyInfo="myInfoDialog=false"></my-info>
   <my-review :dialog3="myReviewDialog" v-show="false" v-on:closeMyReview="myReviewDialog=false"></my-review>
   <div>
      <v-app-bar color="#587850" dense dark>
        <v-toolbar-title id="toolbartitle" style="margin-left:auto; margin-right:auto;">
           <div id="mypage">내 군번줄</div>
        </v-toolbar-title>
      </v-app-bar>
   </div>
   <div style="width:100%; height:20px; background-color: #f2f2f2;" />
   <v-card outlined tile>
      <v-row id="rowpadding" align="center" class="fill-height">
      <div id="profile-img" >
         <v-avatar tile>
           <img src="../assets/usericon.jpg" alt="내사진">
         </v-avatar>
      </div>
      <v-col>
          <v-row><div>
    <span v-text="myAge" id="myAge"></span>&nbsp;&nbsp;&#124; &nbsp;&nbsp;     
<span v-text="myGender" id="myGender"></span></div></v-row>
          <v-row> <v-rating                    
                       v-model="myaverage"
                       readonly
                       small
                       dense
                       background-color="grey lighten-1"
                       color="red"
                     ></v-rating>
             <br></v-row>
      </v-col>
      </v-row>
      <v-row align="center">
      <v-col align="center" >
         <v-card outlined tile class="cardpadding">
            <div><p class="text--secondary">등급</p></div>
            <v-avatar tile size="30">
               <v-img v-if="myRank=='이병'"
                       src="../assets/rank1.png"
                       mat="40px"
                     rank1x-width="40px"            
                        style="padding:5px"></v-img>
               <v-img v-if="myRank=='일병'"
                       src="../assets/rank2.png"
                       max-height="40px"
                       max-width="40px"            
                        style="padding:5px"></v-img>
               <v-img v-if="myRank=='상병'"
                       src="../assets/rank3.png"
                       max-height="40px"
                       max-width="40px"            
                        style="padding:5px"></v-img>
               <v-img v-if="myRank=='병장'"
                       src="../assets/rank4.png"
                       max-height="40px"
                       max-width="40px"            
                        style="padding:5px"></v-img>
            </v-avatar>
            <div><p class="font-weight-bold" style="color=#587850"><span v-text="myRank"/></p></div>
         </v-card>
      </v-col>
      <v-col align="center" >
         <v-card outlined tile class="cardpadding">
            <div><p class="text--secondary">리뷰개수</p></div>
            <v-avatar tile size="30">
               <v-icon>far fa-file-alt</v-icon>
            </v-avatar>
            <div><p class="font-weight-bold" style="color=#587850"><span v-text="numofreview"/></p></div>
         </v-card>
      </v-col>
      <v-col align="center" >
         <v-card outlined tile class="cardpadding">
            <div><p class="text--secondary">크레딧</p></div>
            <v-avatar tile size="30">
               <v-icon color="red">fas fa-heart</v-icon>
            </v-avatar>
            <div><p class="font-weight-bold" style="color=#587850"><span v-text="mycredit"/></p></div>
         </v-card>
      </v-col>
      </v-row>   
   </v-card>
   <div style="width:100%; height:20px; background-color: #f2f2f2;" />
   <v-list>
   <div>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i">
       
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
         
          <v-list-item-content >
         <div @click="openMyReview" style="vertical-align:top;">
         <span>
         <v-list-item-title v-text="item.text" style="float:left;">
         </v-list-item-title>
         </span>
         <span>
         
         </span>
         </div>
          </v-list-item-content>
         <v-list-item-icon style="float:right;">
                 <v-icon>fas fa-angle-right</v-icon>
             </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
   </div>
    <!-- <div>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i">
      <div @click="openMyReview">
          <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
          <v-list-item-content>
         <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon><v-icon>fas fa-angle-right</v-icon></v-list-item-icon>
      </div>
        </v-list-item>
      </v-list-item-group>
   </div> -->
    </v-list>   
</v-app>
</template>

<script>
import http from '@/util/http-common.js';
import MyInfo from '@/components/MyInfo.vue';
import MyReview from '@/components/MyReview.vue';
import axios from 'axios';
import store from "../store/index";
   export default {
   name: 'MyPage',
   props: ['dialog', 'info'],
   components: {
   MyInfo,
   MyReview,
   },
   created(){
      this.getUserInfo();
   },
    data: () => ({
   item: 1,
   items: [
   //{ text: '내 정보', icon: 'mdi-account', func: '1' },
   { text: '내가 쓴 리뷰', icon: 'mdi-clock', func: '2' },
   ],
   myInfoDialog: false,
   myReviewDialog: false,
   myEmail:' ',
   myAge:' ',
   myGender:' ',
   myRank:'',
   rankImg:'',
   numofreview:0,
   mycredit:'',
   myaverage:0,
   }),
   methods: {
      openMyInfo(){
         this.myInfoDialog = true;
      },
        openMyReview(){
         this.myReviewDialog = true;
      },
      getUserInfo(){
         http.get('/api/user/'+store.state.user_id,
            {headers: {
         'Authorization' : store.state.access_token,
        }}).then(({data}) => {
            this.myEmail = data.email;
            this.myAge = data.age_range;
            this.myGender = data.gender;
            if(data.gender == "female"){
               this.myGender = "여자";
            }else{
               this.myGender = "남자";
            }
            // this.numofreview = data.reviewcount;
            if(data.age_range=="20~29"){
               this.myAge = "20대";
            }else if(data.age_range=="30~39"){
               this.myAge = "30대";
            }else if(data.age_range=="40~49"){
               this.myAge = "40대";
            }else if(data.age_range=="50~59"){
               this.myAge = "50대";
            }
            let data2 = data;
         })
         
         http.get('/api/user/review/'+store.state.user_id,
            {headers: {
         'Authorization' : store.state.access_token,
        }}).then(({data}) => {
			 console.log("data : "+data)
             this.numofreview = data;   
            if(this.numofreview >=0 && this.numofreview <10){
               this.myRank = "이병";
               this.rankImg = "../assets/rank1.png";
            }else if(this.numofreview >=10 && this.numofreview <30){
               this.myRank = "일병";
               this.rankImg = "../assets/rank2.png";
            }else if(this.numofreview >=10 && this.numofreview <30){
               this.myRank = "상병";
               this.rankImg = "../assets/rank3.png";
            }else{
               this.myRank = "병장";
               this.rankImg = "../assets/rank4.png";
            }
            console.log("rank: " + this.myRank);
            console.log("이미지 : " + this.rankImg);
         })
         
         http.get('/api/user/credit/'+store.state.user_id,
            {headers: {
         'Authorization' : store.state.access_token,
        }}).then(({data}) => {
            this.mycredit = data;
         })
         
         http.get('/api/user/sum/'+store.state.user_id,
            {headers: {
         'Authorization' : store.state.access_token,
        }}).then(({data}) => {
			 console.log("data2 = "+(data/this.numofreview).toFixed(1))
            this.myaverage = this.numofreview?(data/this.numofreview).toFixed(1):0;
				
         })
      },//getUserInfo
   },
   
   }
</script>

<style scoped>
   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&family=Kalam:wght@300;700&display=swap');
/* 
   #myinfo{
      height:20px;
      clear : both;
   } */
   #usericon{
      float:left;
   }
   #userinfo{
      float:left;
   }
   #profile-img{
      margin: 15px;
   }
   #mypage{
      justify-content : center;
      margin:0 auto; 
   }
   .cardpadding{
      height: 100px;
      /* height: 70px; */
      padding: 10px;   
   }
   .col{
      padding:0;
      margin:0;
   }
   .row{
      width: 100%;
      margin: 0;
   }
   .text--secondary{
      margin-bottom: 4px;
   }
</style>

<!-- <template>
    <v-app>
   <my-info :dialog3="myInfoDialog" v-show="false" v-on:closeMyInfo="myInfoDialog=false"></my-info>
   <my-review :dialog3="myReviewDialog" v-show="false" v-on:closeMyReview="myReviewDialog=false"></my-review>
   <div>
   <v-list-item>
      <v-list-item-content>
      <div @click="openMyInfo">
         <span class="text-h5 mb-2" style="display: inline-block;">내 정보</span>         
      </div>
      <div @click="openMyReview">
         <span class="text-h5 mb-2" style="display: inline-block;">내가 쓴 리뷰</span>         
      </div>   
      </v-list-item-content>        
   </v-list-item>   
   </div>         
   </v-app>
</template>
<script>
import http from '@/util/http-common.js';
import MyInfo from '@/components/MyInfo.vue';
import MyReview from '@/components/MyReview.vue';
export default {
  name: 'MyPage',
  components: {
   MyInfo,
   MyReview,
  },
  data() {
    return {
      myInfoDialog: false,
      myReviewDialog: false,
    }
  },methods: {
      openMyInfo(){
         this.myInfoDialog = true;
      },
        openMyReview(){
         this.myReviewDialog = true;
      },
   },
};
</script> -->


         <!-- <div>
            등급<br>      
         </div>
         <v-avatar tile size="80" color="grey"></v-avatar>
         <div>
            <br>이등병      
         </div>
      </v-col>
      <v-col align="center" >
         <div>
            등급<br>      
         </div>
         <v-avatar tile size="80" color="grey"></v-avatar>
         <div>
            <br>이등병      
         </div>
      </v-col>
      <v-col align="center" >
         <div>
            등급<br>      
         </div>
         <v-avatar tile size="80" color="grey"></v-avatar>
         <div>
            <br>이등병      
         </div> -->