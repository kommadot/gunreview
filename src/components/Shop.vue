<template>
	<div>
			<!-- 입력한 주소에 해당하는 위치를 맵에 추가합니다. -->			
			<!-- <input type="text" placeholder="search" v-model="searchTxt" @keydown.enter="locationSearch"> -->
		
			<!-- 입력한 키워드에 적합한 장소을 맵에 추가합니다. -->
			<input type="text" placeholder="search" v-model="searchTxt" @keydown.enter="keywordSearch">			
			  <input type="checkbox" id="food" value="맛집" v-model="checkedCategory">
			  <label for="food">맛집</label>
			  <input type="checkbox" id="pc" value="PC방" v-model="checkedCategory">
			  <label for="pc">PC방</label>
			  <input type="checkbox" id="cinema" value="영화관" v-model="checkedCategory">
			  <label for="cinema">영화관</label>
			  <br>
  				<span>체크한 카테고리: {{ checkedCategory }}</span>
			
			<div id="map" style="width:100%;height:700px;"></div>
			<Review :title='title' :isClick='isClick'></Review>
	</div>
</template>

<script>

import http from "@/util/http-common.js"
import axios from "axios"
import Review from "@/components/Review.vue";
	
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}
export default {
	components: {
		Review
	},
    data(){
        return{
			searchTxt:"",
            shops:[],
			map:null,
			mapOption:"",
			mapContainer:"",
			geocoder:"",
			checkedCategory:[],
			title:'',
			isClick:false,
        }
    },
    created(){
		
    },
    mounted(){
		this.geocoder=new kakao.maps.services.Geocoder();
		this.mapContainer = document.getElementById('map'), 
		this.mapOption = { 
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};
		this.map = new kakao.maps.Map(this.mapContainer, this.mapOption);
		// var markerImage = new kakao.maps.MarkerImage(apartImageSrc, imageSize, imageOption)
		// data.forEach(element => {
		//     geocoder.addressSearch(element.address,(result,status)=>{
		//         if(status === kakao.maps.services.Status.OK){
		//             let markerPosition = new kakao.maps.LatLng(result[0].address.y, result[0].address.x);
		//             let marker = new kakao.maps.Marker({
		//                 map:this.map,
		//                 position:markerPosition,
		//                 title:element.aptName,
		//                 image:markerImage,
		//             })

		//             var aa = function(){
		//                 this.infow(element.no)
		//             }.bind(this)
		//             kakao.maps.event.addListener(marker, 'click',aa);
		//         }
		//     })

		// })

    },
    methods:{
		locationSearch(){			
			// 주소로 좌표를 검색합니다
			this.geocoder.addressSearch(this.searchTxt, (result, status)=> {				
				
				console.dir(result);
				console.dir(status);
				
				// 정상적으로 검색이 완료됐으면 
				 if (status === kakao.maps.services.Status.OK) {
					
					let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

					// 결과값으로 받은 위치를 마커로 표시합니다
					let marker = new kakao.maps.Marker({
						map: this.map,
						position: coords
					});

					// 인포윈도우로 장소에 대한 설명을 표시합니다
					let infowindow = new kakao.maps.InfoWindow({
						content: '<div style="width:150px;text-align:center;padding:6px 0;">?!</div>'
					});
					infowindow.open(this.map, marker);

					// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
					this.map.setCenter(coords);
				} 
			}); 
		},
		
		//키워드로 장소를 검색합니다.
		keywordSearch(){
			var places = new kakao.maps.services.Places();
			var map = this.map;
			var getPlace = this.getPlace;
			
			var callback = function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					console.log(result);
					
					for(let i in result){					
						let coords = new kakao.maps.LatLng(result[i].y, result[i].x);

						// 결과값으로 받은 위치를 마커로 표시합니다
						let marker = new kakao.maps.Marker({
							map: map,
							position: coords
						});

						// 인포윈도우로 장소에 대한 설명을 표시합니다
						let infowindow = new kakao.maps.InfoWindow({
							content: '<div style="width:150px;text-align:center;padding:6px 0;">' + result[i].place_name + '</div>'
						});						
						
						// 마커 위에 인포윈도우를 표시합니다
						infowindow.open(map, marker);  
						
						// 마커에 클릭이벤트를 등록합니다						
						kakao.maps.event.addListener(marker, 'click', function(el) {							
							console.dir(result[i].id);
							
							// 서버로 클릭한 장소에 대한 정보를 요청합니다.
							getPlace(result[i].id, result[i].place_name);
						});
						
						

						// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
						map.setCenter(coords);
					}
				}
			};

			places.keywordSearch(this.searchTxt, callback);
		},
		
		// 장소id에 해당하는 정보를 서버에 요청합니다.
		getPlace(id, name){
			//https -> http로의 요청으로 인해 브라우저에서 보안 문제로 요청을 차단될 수 있습니다
			//https://docs.adobe.com/content/help/ko-KR/target/using/experiences/vec/troubleshoot-composer/mixed-content.translate.html를 참조하여 설정하거나 https -> https 또는 http -> http로 요청하는 형태가 되어야 합니다
			//axios.get('http://3.23.110.174:8080/GunReview/api/shop/' + '16618597') //테스트
			axios.get('http://3.23.110.174:8080/GunReview/api/shop/' + id)			
			     .then(({data}) => {
					console.dir(data);				
					this.title = name;
					this.isClick = !this.isClick;
					/*
						반환된 장소 정보를 출력하는 코드를 작성합니다.
						
						
						
						
					*/
				})
		},
    },
}
</script>

<style>
</style>
