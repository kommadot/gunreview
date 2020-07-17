import axios from "axios";
// import {mapState} from "vuex";
// import Vue from "vue"
import store from "../store/index"
// axios 객체 생성
// var vueObject = new Vue({
// 	computed:{
// 		...mapState(["access_token"])
// 	}
// })
export default axios.create({
  baseURL: "https://gunreview.ml/gunreview",
  headers: {
	//"AUTHORIZATION" : store.state.access_token,
    "Content-type": "application/json"
  }
});
 