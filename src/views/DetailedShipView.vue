<script setup>
import CheckLogin from "../components/checkLogin.vue";
import Ship from "../components/Ships/DetailedShipComp.vue";
import axios from 'axios';
import {ref, onBeforeUnmount} from 'vue'

import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginToken'

const store = useLoginStore();
const {token} = storeToRefs(store);

const props = defineProps(['id']);

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
    axios.get('https://api.spacetraders.io/v2/my/ships/' + props.id,  axiosConfig)
            .then(function (response) {
                console.log(response);
                shipInfo.value = response.data.data;
                autoMineDisabled.value = !(shipInfo.value.cargo.units < shipInfo.value.cargo.capacity);
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

const intervalIds = ref([]);

if(token.value != null) {
    
    let timeInSeconds = 5;
    let intervalID = window.setInterval(GetShipInfo, timeInSeconds * 1000);
    intervalIds.value.push(intervalID);

    onBeforeUnmount(() => {
        for(let id of intervalIds.value)
        {
            console.log(id);
            window.clearInterval(id);
        }
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

                if(autoMineId.value) 
                {
                    autoMineDisabled.value = true;
                    window.clearInterval(autoMineId.value);
                }
                
            }).finally(()=>{
                GetShipInfo();
            });
}
function Sell(symbol, amount) 
{
    ClearError();
    if(amount <= 0)
    {
        LogError("Cannot sell nothing!");
        return;
    }

    axios.post('https://api.spacetraders.io/v2/my/ships/' + props.id + '/sell', {"symbol":symbol, "units":Number(amount)},  axiosConfig)
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



function Deliver(symbol, amount, contractId) 
{
    ClearError();
    if(amount <= 0)
    {
        LogError("Cannot deliver nothing!");
        return;
    }

    if(contractId == "")
    {
        LogError("Please enter a contract Id!");
        return;
    }

    axios.post('https://api.spacetraders.io/v2/my/contracts/' + contractId.value + '/deliver', {"shipSymbol":props.id, "tradeSymbol":symbol, "units":Number(amount)},  axiosConfig)
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

const autoMineId = ref(null);
const autoMineDisabled = ref(false);
function AutoMine(shipId, isOn)
{
    if(isOn)
    {
        if(shipInfo.value.cooldown.remainingSeconds == 0) extract(shipId);

        //TODO set timeout for remaining seconds and then trigger the interval to fire off for the total length of time
        autoMineId.value = window.setInterval(() => {
            console.log("Extracting!");
            extract(shipId);
        }, 71 * 1000);

        intervalIds.value.push(autoMineId.value);
    }
    else
    {
        console.log("Done Automine!");
        window.clearInterval(autoMineId.value);
    }
}
</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1 v-if="shipInfo" style="text-align:center">Ship Info {{ shipInfo.registration.name }}</h1>
    <p>{{ errorMessage }}</p>
    <div v-if="shipInfo" class="ship-container">
        <Ship :autoMineDisabled="autoMineDisabled" :ship="shipInfo" @auto-mine="AutoMine" @deliver="Deliver" @dock="Dock" @extract="extract" @travel="Travel" @refuel="Refuel" @orbit="GoToOrbit" @sell="Sell"></Ship>
    
    </div>


  </main>
</template>

<style scoped>

</style>