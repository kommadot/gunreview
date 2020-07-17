<template>
    <v-app>
		
		<place-review :dialog="dialog" :info="info" v-show="false" v-on:closeReview="dialog=false"></place-review>
		<v-dialog
		  v-model="orderDialog"
		  max-width="290"
		>
			  <v-list flat>
			  <v-subheader>정렬 기준</v-subheader>
			  <v-list-item-group v-model="order" color="primary">				
				<v-divider></v-divider>
				<v-list-item>								  
				  <v-list-item-content>
					<v-list-item-title v-text="'평점순'"></v-list-item-title>
				  </v-list-item-content>
				  <v-list-item-icon>
					 <v-icon dark right>mdi-check</v-icon>
				  </v-list-item-icon>				
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item>								  
				  <v-list-item-content>
					<v-list-item-title v-text="'이용순'"></v-list-item-title>
				  </v-list-item-content>
				  <v-list-item-icon>
					 <v-icon dark right>mdi-check</v-icon>
				  </v-list-item-icon>
				</v-list-item>
				</v-list-item-group>
				<v-divider></v-divider>
				<v-list-item-group color="primary" mandatory>		
				<v-list-item @click="orderDialog=false">			
				  <v-list-item-content/>
				  <v-list-item-icon>
					  <v-list-item-title>취소</v-list-item-title>
				  </v-list-item-icon>
				</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-dialog>
        <div id="map" style="width: 100%; height: 100%; position: fixed;" @touchstart="clickMap"></div>
        <div>
            <v-text-field
				ref="searchField"
                solo
						  inner
						  border-color="green darken-2"
                label="주소 검색"
                prepend-inner-icon="mdi-menu"
                v-model="searchTxt"
                @keydown.enter="locationSearch"
                class="ma-3"
                style="opacity: 0.7;"		
                @click:prepend-inner="drawer = !drawer"						  
				@click="getFilter"
				hide-details="true"
				id="search"
            ></v-text-field>
        </div>
        <!-- <Review :title="title" :isClick="isClick" :id="id"></Review> -->

            <v-navigation-drawer v-model="drawer" absolute temporary width="70%">
                <v-list>
                    <v-list-item>
                        <v-btn icon @click="drawer=!drawer">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        필터
                    </v-list-item>
                    <v-divider></v-divider>
					<v-container class="ma-3 py-0">
						

						<v-row align="center" justify="center">
						<v-col v-for="item in keywords" :key="item.name">
												<v-btn-toggle
						  v-model="checkedCategory"
						  color="green darken-3"
						  dense
						  group
						  multiple
						rounded
						>
						  <v-btn :value="item" text>
							<v-icon>{{item.icon}}</v-icon>
							  {{item.name}}
						  </v-btn>
													</v-btn-toggle>
						</v-col>
							</v-row>
					
					
						</v-container>
                    <v-divider></v-divider>
					<v-list-item>
						<fieldset >
							<legend>
								최소평점
							</legend>
								<v-rating						  
								  v-model="minRate"
								  half-increments
								  half-icon="mdi-star-half-full"
								  background-color="grey lighten-1"
								  color="red"
										  clearable
								></v-rating>
						</fieldset>
					</v-list-item>
                </v-list>
            </v-navigation-drawer>
		
		
		      <v-snackbar
        v-model="snackbar"
        :timeout="2000"
						  style="text-align:center;"
      >
        검색하고자 하는 카테고리를 골라주십시오.
      </v-snackbar>	
			<v-bottom-sheet v-model="sheet" scrollable hide-overlay persistent>
				<v-overlay :value="isLoading">
        	<v-progress-circular indeterminate size="64"></v-progress-circular>
      	</v-overlay>
				<v-card tile @touchstart="onTouchStart"  @touchmove="onTouchMove">
				<v-list  dense>
					<div style="float:right; margin-right:10px" @click="orderDialog=true">				 	
						{{order | orderToString}}<i class="fas fa-caret-down" style="color:gray"></i>
					</div>
				</v-list>
				<v-divider></v-divider>
				<v-card-text style="height: 200px;" ref="test" id="scroll-target" @touchstart="onTouchStart"  @touchmove="onTouchMove">
					<v-layout
					v-scroll:#scroll-target="onScroll"
					column
					align-center
					justify-center					
					>
				  </v-layout>
					
					<v-card tile flat>
				  <v-list three-line>
					<template v-for="(shop, index) in shops">					  
					  <v-list-item :key="shop.id + '_item'" @click="uploadPlace(shop)">						
						<v-list-item-content>
						  <v-list-item-subtitle>							
							<v-rating						  
							  v-model="shop.average"
							  readonly
							  small
							  half-increments
						  	  half-icon="mdi-star-half-full"
							  dense
							  background-color="grey lighten-1"
							  color="red"							  
							></v-rating>
						  </v-list-item-subtitle>
							
						  <v-list-item-subtitle>
							  <span class='text--primary' style="font-size:1.0em;">{{shop.place_name}}</span> &#124; {{shop.category_group_name}} &nbsp; <i class="fas fa-user-friends" style="color:gray"></i>	{{shop.review_num}}
						  </v-list-item-subtitle>
						  <div style="height:5px"></div>						  
							<v-img
							  :src = "'https://gunreview.ml/gunreview/resources/upload/'+shop.rep_img"
							  max-height="60px"
							  max-width="100px"
							></v-img>
						</v-list-item-content>
					  </v-list-item>
					  <v-divider :key="index + '_divider'"></v-divider>
					</template>
				  </v-list>
				</v-card>				 
				</v-card-text>
			  </v-card>	  
      		</v-bottom-sheet>
    </v-app>
</template>

<script>
    import http from '@/util/http-common.js';
    import axios from 'axios';
	import PlaceReview from "@/components/PlaceReview.vue"
	import store from "../store/index"
	
    String.prototype.replaceAll = function (org, dest) {
        return this.split(org).join(dest);
    };
    export default {
        components: {
			PlaceReview,
        },
        data() {
            return {				
                searchTxt: '',
                shops: [],
                map: null,
                mapOption: '',
                mapContainer: '',
                geocoder: '',
                checkedCategory: [],

                location: null,
                markers: {},

                title: '',
                id: '',
                isClick: false,
				
				average:0,
				minRate:0,
				
                keywords: [{name:"PC방",icon:"mdi-desktop-mac"},{name: '맛집',icon:"mdi-food"},{name: '영화관',icon:"mdi-popcorn"},{name:'모텔',icon:"mdi-bed"},{name:"찜질방",icon:"mdi-hot-tub"}, {name:"복지 시설", icon:"mdi-hospital-building"}],
                drawer: null,
				snackbar:null,
				sheet: false,	
				
				posY:0,
				offsetTop: 0,
				
				dialog: false,
				info:{},
				
				orderDialog: false,
				order:null,
				
				curY: 0,
				curX: 0,
				
				isLoading: false,
				shopCount: 0,
            };
        },
		filters: {
			orderToString(order){
				if(order == 0){
					return "평점순"
				}else if(order == 1){
					return "이용순"
				}else{
					return "정렬"
				}
				
			}
		},
        created() {
		},
        mounted() {
            this.geocoder = new kakao.maps.services.Geocoder();
            (this.mapContainer = document.getElementById('map')),
                (this.mapOption = {
                    center: new kakao.maps.LatLng(37.530162, 126.964185),
                    level: 3,
                });
            this.map = new kakao.maps.Map(this.mapContainer, this.mapOption);
        },
        methods: {
			onTouchStart(e){
				this.posY = e.targetTouches[0].clientY				
			},
			onTouchMove (e) {								
				var maxHeight = this.$refs.test.scrollHeight
				var height = this.$refs.test.clientHeight;
				this.$refs.test.style.height = (parseInt(this.$refs.test.style.height) + this.posY - e.targetTouches[0].clientY)+'px';
				this.posY = e.targetTouches[0].clientY;
				this.offsetTop = parseInt(this.$refs.test.style.height) - height;				
				if(parseInt(this.$refs.test.style.height) > maxHeight)
					this.$refs.test.style.height = maxHeight + 'px';	
				if(parseInt(this.$refs.test.style.height) == 0){
					this.sheet = false;
				}
				
			},
			onScroll(e) {
				$('#scroll-target').scrollTop(this.offsetTop);
			},
			getFilter(){
				this.sheet = false;
				if(this.checkedCategory.length===0){
					this.drawer=true;
					this.snackbar=true;
					document.getElementById("search").blur();
				}
			},
            locationSearch() {
				this.isLoading = true;
				this.shopCount = 0;
                this.geocoder.addressSearch(this.searchTxt, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
						this.curY = result[0].y;
						this.curX = result[0].x;
						this.shops = []
                        this.location = new kakao.maps.LatLng(result[0].y, result[0].x);
                        this.map.setCenter(this.location);
						this.getMarkers();
						this.sheet = true;
                    }
                });
                this.markers = {};				
            },
			addShop(shop){
				if(shop.review_num){
					shop.average = (shop.review_num == 0 ? 0 : shop.sum_rate / shop.review_num).toFixed(1);
				}else{
					shop.average = 0;
				}
				if(this.minRate <= parseFloat(shop.average)){
					this.shops.push(shop);
					this.addMarker(shop);
					this.shopCount--;
					if(this.shopCount == 0){
						this.isLoading = false;
					}
				}
			},
			uploadPlace(shop){
				this.showPlaceReview(shop);
			},
			uploadPlace2(shop){
				http.post('/api/shop', {
					address_name: shop.address_name ,
					category_group_code: shop.category_group_code ,
					category_group_name: shop.category_group_name ,
					id: shop.id ,
					lat: shop.y,
					lng: shop.x,
					phone: shop.phone,
					place_name: shop.place_name,
					place_url: shop.place_url,
				    road_address_name: shop.road_address_name
				},{headers: {
			'Authorization' : store.state.access_token,
		  }})
											
			},
			showPlaceReview(shop){
				this.info = shop;
				this.dialog = true;
			},
			clickMap(){
				this.$refs.test.style.height = '0px';
			},
            getPlace(result) {
                http.get('/api/shop/' + result.id,{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({ data }) => {
                    if(data.length===0){
						http.post('/api/shop', {
						  address_name: result.address_name ,
						  category_group_code: result.category_group_code ,
						  category_group_name: result.category_group_name ,
						  id: result.id ,
						  lat: result.y,
						  lng: result.x,
						  phone: result.phone,
						  place_name: result.place_name,
						  place_url: result.place_url,
						  road_address_name: result.road_address_name
						},{headers: {
					'Authorization' : store.state.access_token,
		  			}})
					}					
                });
            },
			addMarker(result){
				console.dir(result);
				var uploadPlace = this.uploadPlace;
				var showPlaceReview = this.showPlaceReview;
				let coords = new kakao.maps.LatLng(
					result.lat,
					result.lng
				);
				let marker = new kakao.maps.Marker({
					map: this.map,
					position: coords,
				});
				kakao.maps.event.addListener(marker, 'click', function (
					el
				) {
					showPlaceReview(result);											
				});
				//this.array.push(marker);	
			},
			getMarkers(){
				console.dir(this.checkedCategory)
				for (let key in this.markers) {
                    this.markers[key].forEach((marker) => {
                        marker.setMap(null);
                    });
                }

                this.checkedCategory.forEach((element) => {
                        let places = new kakao.maps.services.Places();
                        var map = this.map;
                        var getPlace = this.getPlace;
                        var array = [];
						var uploadPlace = this.uploadPlace;
						var uploadPlace2 = this.uploadPlace2;
						var addShop = this.addShop;
					
						if(element.name == '복지 시설'){
							axios.get('https://gunreview.ml/gunreview/api/welfare',{headers: {
											'Authorization' : store.state.access_token
										  }}).then(({data}) => {
								this.shopCount += data.length
								for(let i in data) {
									console.dir(data[i]);
									addShop(data[i]);
								}								
							})
						}else{					
                        places.keywordSearch(
                            element.name,
                            (result, status) => {									
                                if (status === kakao.maps.services.Status.OK) {
									this.shopCount += result.length;
                                    for (let i in result) {
										axios.get('https://gunreview.ml/gunreview/api/shop/'+result[i].id,{headers: {
											'Authorization' : store.state.access_token,
											"Content-type": "application/json"
										  }}).then(({data}) => {
											if(data.length == 0){
												uploadPlace2(result[i]);
												result[i].sum_rate = 0
												result[i].review_num = 0;
												addShop(result[i])
											}
											else{
												addShop(data);												
											}
										})
                                        
                                    }
                                }
                            },
                            { location: this.location }
                        );
                        this.markers[element.name] = array;
					}
                    
                })
			}
        },
        computed: {
            selections() {
                const selections = [];
                for (const selection of this.checkedCategory) {
                    selections.push(selection);
                }
                return selections;
            },
            allSelected() {
                return this.checkedCategory.length === this.keywords.length;
            },
        },
        watch: {
            order(){
				this.isLoading = true;
				this.shops = [];
				if(this.order != null){
					http.get(`/api/shop/loc/${this.curY}/${this.curX}`,{headers: {
			'Authorization' : store.state.access_token,
		  }}).then(({data}) => {
						console.dir(data)
						for(let i in data) {	
							data[i].average = (data[i].review_num == 0 ? 0 : data[i].sum_rate / data[i].review_num).toFixed(1);
						}
						if(this.order == 0){							
							data.sort(function(a, b) { // 내림차순	
								return parseFloat(b.average) - parseFloat(a.average);
							});
						}else{
							data.sort(function(a, b) { // 내림차순								
								return parseFloat(b.review_num) - parseFloat(a.review_num);
							});
						}
						console.dir(data)
						for(let i in data) {	
							this.addShop(data[i])
						}
					}).finally(() => {
						this.isLoading = false;
					})
				}else{
					this.getMarkers();
				}
			}
        },
    };
	// 서버 요청 id -> 있 -> 최소평점 거르기 : 없으면 -> 서버등록 -> 받아오기 -> 최소평점 거르기.
</script>
0

rate


<style scoped>
	fieldset{
		width:wrap;
		height:80px;
		margin:auto;
		padding-left:3%;
		padding-right:3%;
		border-color:#43A047;
		border-radius:3px;
	}
	fieldset legend{
		color:#81C784;
	}
</style>