import Vue from 'vue'
import Vuex from 'vuex'
// import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  access_token:sessionStorage.getItem('access_token'),
	  user_id:sessionStorage.getItem('user_id'),
	  pxData: sessionStorage.getItem('pxData') ? JSON.parse(sessionStorage.getItem('pxData')) : [],
	  total: sessionStorage.getItem('total') ? JSON.parse(sessionStorage.getItem('total')) : [],
	  
  },
  mutations: {
	ADD_TOKEN(state, access_token) {
     	state.access_token = access_token;
		sessionStorage.setItem('access_token',access_token)
		console.dir(state.access_token);
    },
	LOGIN(state,app_id){
		sessionStorage.setItem('user_id',app_id)
		state.user_id=app_id;
	},
	SET_PXDATA(state, data){
		var pxData = [];
		var total = [];
		var preMonth = 0;
		var cnt = 1
		
		for(let i in data){
			if(preMonth != data[i].month){
				cnt = 1;
				preMonth = data[i].month;
				if(!total[data[i].year+'']){
					total[data[i].year+''] = 0
				}
				total[data[i].year+'']++;
			}
			
			if(!pxData[data[i].name]){
				pxData[data[i].name] = [];
			}
			if(!pxData[data[i].name][data[i].year+'']){
				pxData[data[i].name][data[i].year+''] = []
				pxData[data[i].name][data[i].year+'']['rank'] = 0
				pxData[data[i].name][data[i].year+'']['cnt'] = 0
			}
			pxData[data[i].name][data[i].year+'']['rank'] += cnt;
			pxData[data[i].name][data[i].year+'']['cnt']++;			

			cnt++;
		}
		state.pxData = pxData;
		state.total = total;
		sessionStorage.setItem('pxData',JSON.stringify(pxData));
		sessionStorage.setItem('total',JSON.stringify(total));
		console.dir(pxData);
		console.dir(total)
	},
  },
  actions: {
  },
  modules: {
  }
})