<template>
    <v-app>
        <div id="map" style="width: 100%; height: 100%; position: fixed;"></div>
        <div>
            <v-text-field
                solo
                label="Search"
                append-icon="mdi-menu"
                v-model="searchTxt"
                @keydown.enter="locationSearch"
                class="ma-3"
                style="opacity: 0.7;"
                @click:append="drawer = !drawer"
				autofocus
				hide-details="true"
            ></v-text-field>
        </div>
        <!-- <Review :title="title" :isClick="isClick" :id="id"></Review> -->

            <v-navigation-drawer v-model="drawer" absolute temporary width="70%">
                <!-- <v-list>
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
						<fieldset>
							<legend>
								최소평점
							</legend>
								<v-rating						  
								  v-model="average"
								  half-increments
								  half-icon="mdi-star-half-full"
								  background-color="grey lighten-1"
								  color="red"
								></v-rating>
						</fieldset>
					</v-list-item>
                </v-list> -->
            </v-navigation-drawer>
		
			<!-- <v-bottom-sheet v-model="sheet" scrollable >
				<v-card>
				<v-card-title>정렬 옵션 구현하기</v-card-title>
				<v-divider></v-divider>
				<v-card-text style="height: 100px;" ref="test" id="scroll-target">
					<v-layout
					v-scroll:#scroll-target="onScroll"
					column
					align-center
					justify-center
					>
				  </v-layout>
				  <div v-for="(shop,idx) in shops" :key="idx+'_'">
					  {{shop.place_name}}
				  </div>
				  <div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
						<div>공백  </div>
				</v-card-text>
			  </v-card>	  
      		</v-bottom-sheet> -->
    </v-app>
</template>

<script>
    import http from '@/util/http-common.js';
    import axios from 'axios';

    String.prototype.replaceAll = function (org, dest) {
        return this.split(org).join(dest);
    };
    export default {
        components: {
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
				
                keywords: [{name:"PC방",icon:"mdi-desktop-mac"},{name: '맛집',icon:"mdi-food"},{name: '영화관',icon:"mdi-popcorn"},{name:'모텔',icon:"mdi-bed"},{name:"찜질방",icon:"mdi-hot-tub"}],
                drawer: null,
				
				sheet: false,	
            };
        },
        created() {},
        mounted() {
            this.geocoder = new kakao.maps.services.Geocoder();
            (this.mapContainer = document.getElementById('map')),
                (this.mapOption = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                });
            this.map = new kakao.maps.Map(this.mapContainer, this.mapOption);
        },
        methods: {
			onScroll (e) {
				this.offsetTop = e.target.scrollTop;
				this.$refs.test.style.height = this.offsetTop + 100 + 'px';
				console.dir(this.$refs.test.style.height);
			},
			
            locationSearch() {
                this.geocoder.addressSearch(this.searchTxt, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        this.location = new kakao.maps.LatLng(result[0].y, result[0].x);
                        this.map.setCenter(this.location);
                    }
                });
                this.checkedCategory = [];
                this.markers = {};
            },

			
            getPlace(result) {
                http.get('/api/shop/' + result.id).then(({ data }) => {
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
						})
					}
					
                });
            },
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
            checkedCategory() {
                for (let key in this.markers) {
                    this.markers[key].forEach((marker) => {
                        marker.setMap(null);
                    });
                }

                this.checkedCategory.forEach((element) => {
                    if (this.markers[element.name] !== undefined) {
                        this.markers[element.name].forEach((marker) => {
                            marker.setMap(this.map);
                        });
                    } else {
                        let places = new kakao.maps.services.Places();
                        var map = this.map;
                        var getPlace = this.getPlace;
                        var array = [];
                        places.keywordSearch(
                            element.name,
                            (result, status) => {
								this.shops = result;
								this.sheet = true;
                                if (status === kakao.maps.services.Status.OK) {
                                    for (let i in result) {
                                        let coords = new kakao.maps.LatLng(
                                            result[i].y,
                                            result[i].x
                                        );

                                        // 결과값으로 받은 위치를 마커로 표시합니다
                                        let marker = new kakao.maps.Marker({
                                            map: this.map,
                                            position: coords,
                                        });
                                        kakao.maps.event.addListener(marker, 'click', function (
                                            el
                                        ) {
											http.post('/api/shop', {
											  address_name: result[i].address_name ,
											  category_group_code: result[i].category_group_code ,
											  category_group_name: result[i].category_group_name ,
											  id: result[i].id ,
											  lat: result[i].y,
											  lng: result[i].x,
											  phone: result[i].phone,
											  place_name: result[i].place_name,
											  place_url: result[i].place_url,
											  road_address_name: result[i].road_address_name
											})
											window.open(`placereview?title=${result[i].place_name}&id=${result[i].id}`);
                                        });
										// kakao.maps.event.addListener(marker, 'click',getPlace(result[i]))
                                        array.push(marker);
                                    }
                                }
                            },
                            { location: this.location }
                        );
                        this.markers[element.name] = array;
                    }
                });
				console.log(this.markers);
            },
        },
    };
</script>

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