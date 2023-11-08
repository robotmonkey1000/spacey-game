<script setup>
import CheckLogin from "../components/checkLogin.vue";
import Ship from "../components/Ships/InventoryShipComp.vue";
import axios from 'axios';
import {ref, onBeforeUnmount} from 'vue'

import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginToken'
import router from "../router";

const store = useLoginStore();
const {token} = storeToRefs(store);


const orbitResponse = ref();
const errorMessage = ref("");

function ClearError() {
    errorMessage.value = "";
}

function GoToOrbit(shipId)
{
    ClearError();
    axios.post('https://api.spacetraders.io/v2/my/ships/' + shipId + '/orbit', {},  axiosConfig)
            .then(function (response) {
                console.log(response);
                orbitResponse.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
            }).finally(()=>{
                GetShipInfo();
            });
}

function Dock(shipId)
{
    ClearError();
    axios.post('https://api.spacetraders.io/v2/my/ships/' + shipId + '/dock', {},  axiosConfig)
            .then(function (response) {
                console.log(response);
                orbitResponse.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            }).finally(()=>{
                GetShipInfo();
            });
}

function LogError(message) {
    errorMessage.value = message;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

function Refuel(shipId)
{
    ClearError();
    axios.post('https://api.spacetraders.io/v2/my/ships/' + shipId + '/refuel', {},  axiosConfig)
            .then(function (response) {
                console.log(response);
                orbitResponse.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            }).finally(()=>{
                GetShipInfo();
            });
}



const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

const shipInfo = ref(null);
function GetShipInfo()
{
    axios.get('https://api.spacetraders.io/v2/my/ships',  axiosConfig)
            .then(function (response) {
                console.log(response);
                shipInfo.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
               LogError(error.response.data.error.message);
                
            });



}


if(token.value != null) GetShipInfo();

function Travel(shipId, waypoint)
{
    ClearError();
    console.log(shipId, waypoint);
    axios.post('https://api.spacetraders.io/v2/my/ships/' + shipId + '/navigate', {"waypointSymbol": waypoint},  axiosConfig)
            .then(function (response) {
                console.log(response);
                //orbitResponse.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            }).finally(()=>{
                GetShipInfo();
            });
}

if(token.value != null) {
    
    let timeInSeconds = 10;
    let intervalID = window.setInterval(GetShipInfo, timeInSeconds * 1000);

    onBeforeUnmount(() => {
        window.clearInterval(intervalID);
    })
}

function extract(shipId)
{
    ClearError();
    axios.post('https://api.spacetraders.io/v2/my/ships/' + shipId + '/extract', {},  axiosConfig)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            }).finally(()=>{
                GetShipInfo();
            });
}

function detailed(shipId)
{
    router.push({name:"detailedship", params:{id:shipId}});
}

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1 style="text-align:center">Ship Info</h1>
    <p>{{ errorMessage }}</p>
    <div v-if="shipInfo" class="ship-container">
        <Ship v-for="ship in shipInfo" :ship=ship @detailed-view="detailed" @extract="extract" @refuel="Refuel" @travel="Travel" @dock="Dock" @orbit="GoToOrbit" :key=ship.symbol></Ship>
    </div>


  </main>
</template>

<style scoped>

.ship-container {
    display:flex;
    flex-flow: row wrap;
}

</style>