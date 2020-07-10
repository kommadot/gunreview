<template>
    <v-app>
		<!-- <v-container>
			<v-row><v-col>
        <router-view></router-view></v-col>
</v-row>
			<v-row><v-col>
        <v-bottom-navigation v-model="bottomNav" fixed grow>
            <v-btn value="map" @click="$router.push('/').catch(err => {})">
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn value="px" @click="$router.push('/pxlist').catch(err => {})">
                <span>PX</span>
            </v-btn>
            <v-btn value="account" @click="$router.push('/info').catch(err => {})">
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-bottom-navigation>
	</v-col></v-row>
</v-container> -->

        <router-view></router-view>
        <v-bottom-navigation v-model="bottomNav" fixed grow color="green darken-2" background-color="green lighten-3">
            <v-btn value="map" @click="$router.push('/').catch(err => {})">
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn value="px" @click="$router.push('/pxlist').catch(err => {})">
                <span>PX</span>
            </v-btn>
            <v-btn value="account" @click="$router.push('/info').catch(err => {})">
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