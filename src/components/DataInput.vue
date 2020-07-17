<template>
  	<v-app>
		<v-btn dark label="button" @click="getData">
			버뜬
		</v-btn>
		{{msg}}
	</v-app>
</template>

<script>
import http from "@/util/http-common"
export default {
	data(){
		return {
			msg:"not yet"
		}
	},
	methods:{
		getData(){
			var geocoder = new kakao.maps.services.Geocoder();
			this.msg = "처리중"
			var msg = this.msg;
			http.get("/api/welfare").then(response=>{
				let data = response.data
				data.forEach(res => {
					geocoder.addressSearch(res.address_name, function(result, status) {
					 	if (status === kakao.maps.services.Status.OK) {
							var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
							http.put("/api/welfare/"+res.id,	{
								"address_name": res.address_name,
								"detail": res.detail,
								"event_name": res.event_name,
								"finish_date": res.finish_date,
								"id": res.id,
								"kind": res.kind,
								"lat": result[0].y,
								"lng": result[0].x,
								"phone": res.phone,
								"place_name": res.place_name,
								"place_url": res.place_url,
								"review_num": res.review_num,
								"road_address_name": res.road_address_name,
								"start_date": res.start_date,
								"sum_rate": res.sum_rate,
								"type": res.type
							}).catch(res=>{msg="done"})
							// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
						} 
					});   
				})
			})
		}
	}

}
</script>

<style>

</style>