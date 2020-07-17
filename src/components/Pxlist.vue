<template>
    <v-app>
        <div>
            <v-app-bar scroll-target="#scrolling-techniques-7" dense color="#587850" dark>
                <v-toolbar-title style="margin-left: auto; margin-right: auto;">
                    <div>인기 상품</div>
                </v-toolbar-title>
            </v-app-bar>
        </div>
        <px-review
            :dialog="reviewDialog"
            :info="info"
            v-show="false"
            v-on:closeReview="reviewDialog=false"
        ></px-review>
        <!-- 클릭하면 연도 선택할 수 있는 달력 나오게 -->

        <div
            style="
                top: 0px;
                position: sticky;
                background-color: white;
                z-index: 5;
                padding-botton: 0px;
                padding-top: auto;
            "
        >
            <v-row cols="12" no-gutters>
                <v-col>
                    <div style="text-align: left;">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    label="date"
                                    v-bind="attrs"
                                    v-on="on"
                                    text
                                    large
                                    style="
                                        font-size: 15px;
                                        text-align: left;
                                        margin:auto;
                                    "
                                >
                                    <v-icon left>mdi-calendar-month</v-icon>
                                    {{month}}/{{year}}</v-btn
                                >
                            </template>
                            <v-date-picker
                                v-model="date"
                                color="#d8345f"
                                type="month"
                                no-title
                                scrollable
                                :show-current="false"
                                @input="choice"
                            >
                                <v-spacer></v-spacer>
                                <v-btn text color="#587850" @click="menu = false">Cancel</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </div>
                </v-col>
                <v-col>
                    <div style="text-align: right;">
                        <v-btn
                            v-on:click="pxListoption"
                            style="
                                font-size: 15px;
                                margin: auto;
                            "
                            text
                            >{{pxlistoption}} <i class="fas fa-chevron-down"></i>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-divider></v-divider>
        </div>
        <v-list id="px-list">
            <v-list-item v-if="pxList == null">
                <v-list-item>
                    <div style="width: 100%; text-align: center;">
                        해당하는 데이터가 존재하지 않습니다.
                    </div>
                </v-list-item>
            </v-list-item>
            <v-container fluid v-for="(pxitem, index) in pxList" v-if="pxitem.criteria==pxlistopt">
                <v-row align="center" @click="openPxReview(pxitem)">
                    <v-col :cols="4">
                        <!-- <a>:src="'https://gunreview.ml/gunreview/resources/upload/'+pxitem.rep_img"</a> -->
                        <div id="px-image-id" style="width: 80px; height: 80px; margin: auto;">
                            
							<v-badge
									 avatar
								color=""
								left	 
								overlap
								:value="index<3"
							
							  ><template v-slot:badge>
            						<v-avatar>
								  <!-- <v-icon color="red"> mdi-star</v-icon> -->
										<v-img max-width="20px" :src="badge[index%3]"></v-img>
								</v-avatar>
							  </template>
								<v-avatar
										 class="profile"
										  size="80"
              							tile>
								<v-img
									min-height="100%"
									min-width="100%"
									:src="'https://gunreview.ml/gunreview/resources/upload/'+ pxitem.rep_img | imgFilter"
									class="grey darken-4"
									style="border-radius: 5px;"
								></v-img>
									</v-avatar>
							</v-badge>
                        </div>
                    </v-col>
                    <v-col :cols="7">
                        <v-row id="px-data-id">
                            <v-list-item-title>
                                <!-- <span style="display:block;">{{pxitem.criteria}}</span> -->
                                <span
                                    style="
                                        display: block;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    "
                                    >{{pxitem.name}}</span
                                >
                            </v-list-item-title>
                            <v-list-item-subtitle
                                ><span style="display: block; font-weight: bold;"
                                    >{{pxitem.price | addComma}}원</span
                                ></v-list-item-subtitle
                            >
                            <br />
                            <v-list-item-subtitle style="text-align: right; padding-right: 5%;">
                                <v-spacer></v-spacer>
                                <v-rating
                                    v-model="pxitem.average"
                                    readonly
                                    small
                                    dense
                                    half-increments
                                    half-icon="mdi-star-half-full"
                                    background-color="grey lighten-1"
                                    color="red"
                                ></v-rating>
                            </v-list-item-subtitle>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider :key="index + '_divider'"></v-divider>
            </v-container>
        </v-list>
        <v-snackbar v-model="snackbar" :timeout="4000" :top="true">
            <div @click="getrecentdata">
                <!-- 해당하는 데이터가 존재하지 않습니다.<br> -->
                최신 데이터({{latestyear}}년 {{latestmonth}}월)로 이동하시겠습니까?
            </div>
        </v-snackbar>
        <v-overlay :value="drawer">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-app>
</template>
<script>
    import http from '@/util/http-common.js';
    import PxReview from '@/components/PxReview.vue';
    import store from '../store/index';
    import { mapState } from 'vuex';
	import { mapMutations } from 'vuex';
	import gold from '@/assets/gold.png'
	import silver from '@/assets/silver.png'
	import bronze from '@/assets/bronze.png'
	
    export default {
        name: 'PxList',
        components: {
            PxReview,
        },
        filters: {
            addComma(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
			imgFilter(img_path){
				
				var fileName = img_path.substr(img_path.lastIndexOf('/')+1,4)
				console.dir(fileName)
				if(fileName == 'null' || !fileName)
					return "no_img.png"
				return img_path;
			}
        },
        data() {
            return {
                pxlistoption: '판매금액순',
                pxlistopt: '금액',
                pxlistoptnum: 0,
                latestyear: '',
                latestmonth: '',
                year: '',
                month: '',
                info: {},
                pxList: [],
                dialog: false,
                reviewDialog: false,
                picker: new Date().toISOString().substr(0, 7),
                snackbar: false,
                drawer: false,
                menu: false,
                date: new Date().toISOString().substr(0, 7),
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
				badge:[gold,silver,bronze],
            };
        },
        created() {
            const now = new Date();
            // this.year = 2020;
            // this.month = 5;
            this.year = now.getFullYear();
            this.month = now.getMonth() + 1;
            this.latestyear = 2020;
            this.latestmonth = 5;
            this.month = this.month < 10 ? '0' + this.month : this.month;
            this.getPxList(this.year, this.month);
            this.getPxList(this.year, this.month);
            console.dir(this.$store.state.user_id);
			
			http.get('/api/px',{headers: {
					'Authorization' : store.state.access_token,
				  }}).then(({data}) => {				  
						this.SET_PXDATA(data);			 			  
					})
        },
        methods: {
			...mapMutations(['SET_PXDATA']),
            choice() {
                this.$refs.menu.save(this.date);
                this.menu = false;
                this.month = this.date.substr(5, 7);
                this.year = this.date.substr(0, 4);
                this.getPxList(this.year, this.month);
                console.log(this.date);
            },
            increment: function () {
                this.drawer = true;
                if (this.month < 12) {
                    this.month++;
                } else {
                    this.month = 1;
                    this.year++;
                }
                this.month = this.month < 10 ? '0' + this.month : this.month;
                this.getPxList(this.year, this.month);
            },
            decrement: function () {
                this.drawer = true;
                if (this.month > 1) {
                    this.month--;
                } else {
                    this.month = 12;
                    this.year--;
                }
                this.month = this.month < 10 ? '0' + this.month : this.month;
                this.getPxList(this.year, this.month);
            },

            pxListoption: function () {
                if (this.pxList == null) {
                    this.nodataalert();
                }
                if (this.pxlistoptnum == 0) {
                    this.pxlistoption = '판매량순';
                    this.pxlistopt = '수량';
                    this.pxlistoptnum = 1;
                } else if (this.pxlistoptnum == 1) {
                    this.pxlistoption = '판매금액순';
                    this.pxlistopt = '금액';
                    this.pxlistoptnum = 0;
                }
            },
            openPxReview(info) {
                console.dir(info);
                this.info = info;
                this.reviewDialog = true;
            },
            getrecentdata: function () {
                this.snackbar = false;
                this.drawer = true;
                this.year = this.latestyear;
                this.month = this.latestmonth;
                this.date = this.year + '-' + (this.month < 10 ? '0' + this.month : this.month);
                console.log(this.date);
                this.month = this.month < 10 ? '0' + this.month : this.month;
                this.getPxList(this.year, this.month);
            },
            nodataalert: function () {
                this.snackbar = true;
            },
            getPxList(year, month) {
                this.drawer = true;
                http.get('/api/px/' + year + '/' + month, {
                    headers: {
                        Authorization: store.state.access_token,
                    },
                })
                    .then(({ data }) => {
                        if (data.length != 0) {
                            this.pxList = data;

                            for (let i in this.pxList) {
                                if (this.pxList[i].review_num) {
                                    this.pxList[i].average =
                                        this.pxList[i].sum_rate / this.pxList[i].review_num;
                                } else {
                                    this.pxList[i].average = 0;
                                }
                            }
                        } else {
                            this.nodataalert();
                            this.pxList = null;
                        }
                    })
                    .finally(() => {
                        console.dir(this);
                        this.drawer = false;
                    });
            },
        },
        watch: {
        },
    };
</script>
<style scoped>
    #px-year {
        padding-top: 2%;
        padding-left: 2%;
        font-size: 1.4em;
    }
    #px-month {
        text-align: center;
        font-size: 2em;
    }
    #px-list {
        margin-bottom: 3em;
    }
    #px-list-option {
        text-align: right;
        padding-right: 5%;
        opacity: 0.8;
    }
    #px-list-option:hover {
        opacity: 0.4;
    }
    .pxdivider {
        display: inline-block;
    }
    .eachpx:hover {
        opacity: 0.4;
    }

    #px-data-id {
        display: block;
    }
    #recentdata-btn {
        padding: 25px;
    }
</style>