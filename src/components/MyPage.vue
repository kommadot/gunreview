<template>
    <v-app>
    <div id="px-year">{{ year }}년</div><!-- 클릭하면 연도 선택할 수 있는 달력 나오게 -->
	<div id="px-month">
		<button v-on:click="decrement">
			<span style="display:block;">
				<i class="fas fa-caret-left" style="font-size:30px"></i>
			</span>
		</button>
			<v-dialog v-model="dialog" width="350">
			<template v-slot:activator="{ on, attrs }">
				<v-text v-bind="attrs" v-on="on">
				  {{ month }}월
				</v-text>
			</template>
			<v-card>
			<v-card-text>
			  <v-row justify="space-around">
				<v-date-picker v-model="picker" type="month" color="green lighten-1"></v-date-picker>
			  </v-row>
			</v-card-text>
			<v-card-actions>
			  <v-spacer></v-spacer>
			  <v-btn
				color="primary"
				text
				@click="dialog = false"
			  >
				확인
			  </v-btn>
			</v-card-actions>
			</v-card>
    		</v-dialog>
		<!-- {{ month }}월 -->
<!-- 클릭하면 월 선택할 수 있는 달력 나오게 -->
		<button v-on:click="increment"><span style="display:block;"><i class="fas fa-caret-right" style="font-size:30px"></i></span></button>
	</div>
	<button id="px-list-option" v-on:click="pxListoption">{{pxlistoption}} <i class='fas fa-chevron-down'></i></button>
	<v-list id="px-list">
		<v-list-item v-if="pxList.length == 0">
			<v-list-item><div style="width:100%; text-align:center">등록된 데이터가 없습니다.</div></v-list-item>
		</v-list-item>
	<template v-for="(pxitem, index) in pxList" v-if="pxitem.criteria==pxlistopt">
	  <v-list-item :key="pxitem.no + '_item'" > 
		  <!-- @click="" -->
		<v-list-item-content>
			<div class="eachpx">
				<div class="pxdivider" style="width:10%;">
					<span id="px-index-id">{{index%10+1}}</span>
				</div>
				<div class="pxdivider" style="width:80%;">
					<span id="px-data-id">
						<v-list-item-title >
							<!-- <span style="display:block;">{{pxitem.criteria}}</span> -->
							<span style="display:block;">{{pxitem.name}}</span>
						  </v-list-item-title>
						  <v-list-item-subtitle><span style="display:block;">10,000원</span></v-list-item-subtitle>
						  <v-list-item-subtitle>
							  <v-rating						  
							  v-model="pxitem.review_rate"
							  readonly
							  small
							  dense
							  background-color="grey lighten-1"
							  color="red"
							></v-rating>
						  </v-list-item-subtitle>
					</span>
				</div>
				<div class="pxdivider" style="width:10np,m%;">
					<span id="px-image-id">
						<v-img
						  src="https://picsum.photos/350/165?random"
						  height="60px"
						  width="60px"
						  class="grey darken-4"
						></v-img>
					</span>
				</div>
			</div>
		</v-list-item-content>
	  </v-list-item>
	  <v-divider :key="index + '_divider'" :inset="true"></v-divider>
	</template>
	</v-list>
	</v-app>
</template>
<script>
import http from '@/util/http-common.js';
export default {
  data() {
    return {
		pxlistoption: "판매금액순",
		pxlistopt: "금액",
		pxlistoptnum: 0,
		latestyear: "",
		latestmonth: "",
		year: "",
		month: "",
		info: {},
		pxList: [],
		dialog: false,
		picker: new Date().toISOString().substr(0, 7),
    }
  },
  created() {
	const now = new Date();
	this.year = 2020;
	this.month = "05";
	//this.year = now.getFullYear();
	//this.month = now.getMonth() + 1;
	this.latestyear = 2020;
	this.latestmonth = "05";
	// http.get('/api/px/' + this.year +'/{month}?month='+ this.month).then(({data}) => {
	//  	  this.info = data;
	//    })
	 http.get('/api/px/' + this.year +'/{month}?month='+ this.month).then(({data}) => {
		  console.dir(data);
		  if(data.length != 0) {
			  this.pxList = data;
		  }
	  })  
  },
	methods: {
		// 이전이나 다음 데이터가 없을 때 데이터가 없다고 나와야되는데 그 전에 있던 데이터가 계속 넘어감! 
    increment: function() {
		if(this.latestmonth==this.month && this.latestyear==this.year)
		{
			alert("가장 최근 데이터입니다.");			
		}else{
			if(this.month<12){
    	  		this.month++;		
			}else{
				this.month = 1;
				this.year++;
			}
		this.month = this.month<10?	"0" + this.month : this.month;
		http.get('/api/px/' + this.year +'/{month}?month='+ this.month).then(({data}) => {
		  console.dir(data);
		  if(data.length != 0) {
			  this.pxList = data;
		  }
	  })  
		}
    },
    decrement: function() {
		if(this.month>1){
    	  	this.month--;		
		}else{
			this.month = 12;
			this.year--;
		}
		this.month = this.month<10?	"0" + this.month : this.month;
		http.get('/api/px/' + this.year +'/{month}?month='+ this.month).then(({data}) => {
		  console.dir(data);
		  if(data.length != 0) {
			  this.pxList = data;
		  }
	  })  
    },
	pxListoption: function(){
		if(this.pxlistoptnum==0){
			this.pxlistoption = "판매량순";
			this.pxlistopt = "수량";
			this.pxlistoptnum = 1;
		}else if(this.pxlistoptnum==1){
			this.pxlistoption = "판매금액순";
			this.pxlistopt = "금액";
			this.pxlistoptnum = 0;
		}
	}
  },
};
</script>
<style scoped>
	#px-year{
		padding-top:2%;
		text-align:center;
	}
	#px-month{
		text-align:center;
		font-size:3.0em;
	}
	#px-list{
		margin-bottom:3.0em;	
	}
	#px-list-option{
		text-align:right;
		padding-right:5%;
		opacity:0.8;
	}
	#px-list-option:hover{
		opacity:0.4;
	}
	.pxdivider {
		display:inline-block; 
		/* width:33%; */
		/* border-right:1px solid #f2f2f2 */
	}
	.eachpx:hover{
		opacity:0.4;			
	} 
	#px-index-id{
		display:block;
		/* text-align:center; */
		font-size:2.5em;
		/* width: 1.5em; */
		/* width: 20%; */
	}
	#px-data-id{
		display:block;
		/* width: 60%; */
		/* width: 20em; */
		/* 크기지정 가로폭 기준으로 나눠야되는데 어떻게 해야될지 모르겠음 */
	}
	#px-image-id{
		/* text-align:center; */
		display:block;
		/* width: 5em; */
	}
</style>


