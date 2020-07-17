<template>
    <v-app>
        <router-view></router-view>
        <v-bottom-navigation v-model="bottomNav" fixed shift grow color="#ffffff" background-color="#587850">
            <v-btn value="map" @click="$router.push('/').catch(err => {})">
				<span>군맵</span>
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn value="px" @click="$router.push('/pxlist').catch(err => {})">
                <span>PX</span>
				<v-icon>mdi-shopping</v-icon>
            </v-btn>
            <v-btn value="account" @click="$router.push('/mypage').catch(err => {})">
				<span>내정보</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>

<script>
    export default {
        data() {
            return {
                bottomNav: 'map',
            };
        },
    };
</script>

<style></style>