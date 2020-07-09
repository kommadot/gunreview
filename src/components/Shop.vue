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

            <v-navigation-drawer v-model="drawer" absolute right temporary width="70%">
                <v-list>
                    <v-list-item>
                        <v-btn icon @click="drawer=!drawer">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        필터
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-container class="py-0">
                        <v-row align="center" justify="start">
                            <v-col
                                v-for="(selection, i) in selections"
                                :key="selection.name"
                                class="shrink"
                            >
                                <v-chip close @click="checkedCategory.splice(i, 1)" @click:close="checkedCategory.splice(i, 1)" color="green darken-3" outlined>
                                    <v-icon>{{selection.icon}} </v-icon>
									{{selection.name}}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-divider v-if="checkedCategory.length>0 && checkedCategory.length<keywords.length"></v-divider>
					<v-container class="py-0">
						<v-row align="center" justify="start">
							<v-col v-for="item in keywords" :key="item.name" class="shrink">
								<v-chip
									v-if="!checkedCategory.includes(item)"
									:key="item.name"
									@click="checkedCategory.push(item)"
										color="green darken-1"
										outlined
								>
									<v-icon>{{item.icon}} </v-icon>
									{{item.name}}
								</v-chip>
							</v-col>
						</v-row>
					</v-container>
                    <v-divider></v-divider>
                </v-list>
            </v-navigation-drawer>
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
				
                keywords: [{name:"PC방",icon:"mdi-desktop-mac"},{name: '맛집',icon:"mdi-food"},{name: '영화관',icon:"mdi-popcorn"},{name:'모텔',icon:"mdi-bed"},{name:"찜질방",icon:"mdi-hot-tub"}],
                drawer: null,
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

            //키워드로 장소를 검색합니다.
            // keywordSearch() {
            //     var places = new kakao.maps.services.Places();
            //     var map = this.map;
            //     var getPlace = this.getPlace;

            //     var callback = function (result, status) {
            //         if (status === kakao.maps.services.Status.OK) {
            //             console.log(result);

            //             for (let i in result) {
            //                 let coords = new kakao.maps.LatLng(result[i].y, result[i].x);

            //                 // 결과값으로 받은 위치를 마커로 표시합니다
            //                 let marker = new kakao.maps.Marker({
            //                     map: map,
            //                     position: coords,
            //                 });

            //                 // 인포윈도우로 장소에 대한 설명을 표시합니다
            //                 let infowindow = new kakao.maps.InfoWindow({
            //                     content:
            //                         '<div style="width:150px;text-align:center;padding:6px 0;">' +
            //                         result[i].place_name +
            //                         '</div>',
            //                 });

            //                 // 마커 위에 인포윈도우를 표시합니다
            //                 infowindow.open(map, marker);

            //                 // 마커에 클릭이벤트를 등록합니다
            //                 kakao.maps.event.addListener(marker, 'click', function (el) {
            //                     console.dir(result[i].id);

            //                     // 서버로 클릭한 장소에 대한 정보를 요청합니다.
            //                     getPlace(result[i].id, result[i].place_name);
            //                 });

            //                 // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            //                 map.setCenter(coords);
            //             }
            //         }
            //     };

            //     places.keywordSearch(this.searchTxt, callback);
            // },

            // 장소id에 해당하는 정보를 서버에 요청합니다.
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
            },
        },
    };
</script>

<style scoped></style>