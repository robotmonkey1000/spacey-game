<script setup>
import CheckLogin from '../components/checkLogin.vue';
import Good from '../components/Market/TradeGoodComp.vue'
import Ship from '../components/Ships/MarketShip.vue'
import axios from 'axios';
import {ref} from 'vue';

import { storeToRefs } from 'pinia';
import { useLoginStore } from '@/stores/loginToken';

const store = useLoginStore();
const {token} = storeToRefs(store);

const market = ref("");

const errorMessage = ref("");
const successMessage = ref("");

const props = defineProps(['id']);

const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

const shipInfo = ref(null);
const possibleShips = ref([]);
const selected = ref("");

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
                
            }).finally(() => {
                for(let ship of shipInfo.value)
                {
                    if(ship.nav.waypointSymbol == props.id && ship.nav.status != "IN_TRANSIT")
                    {
                        possibleShips.value.push(ship);
                    }
                }
            });



}

function GetMarketInfo() {

    const splitPoint = props.id.split('-');
    console.log(splitPoint);
    if(splitPoint.length == 3)
    {
        errorMessage.value = "";

        const symbol = splitPoint[0] + '-' + splitPoint[1];
        const url = 'https://api.spacetraders.io/v2/systems/' + symbol + '/waypoints/'+ props.id +'/market';
        axios.get(url,  axiosConfig)
            .then(function (response) {
                console.log(response);
                market.value = response.data.data;
                console.log(market.value);


            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            });
    }
    else
    {
       LogError("Invalid System!");
    }
}

GetShipInfo();
GetMarketInfo();

function select(symbol) {
    selected.value = symbol;
}

function PurchaseGood(symbol, amount)
{
    if(selected.value == "")
    {
        LogError("Please select a ship!");
        return;
    }

    if(amount <= 0)
    {
       LogError("Please enter how many!");
        return;
    }   

    //https://api.spacetraders.io/v2/my/ships/shipSymbol/purchase

    const url = 'https://api.spacetraders.io/v2/my/ships/' + selected.value + '/purchase';
        axios.post(url, {"symbol": symbol, "units": amount},  axiosConfig)
            .then(function (response) {
                console.log(response);
                LogError("");
                successMessage.value = "Purchased " + amount + " of " + symbol + '.';
            })
            .catch(function (error) {
                console.log(error);
                LogError(error.response.data.error.message);
            });

    
}

function LogError(message) {
    errorMessage.value = message;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1 class="page-header">Market {{ props.id }}</h1>
    <p v-if="possibleShips.length == 0">No ships located at this market!</p>
    <p class="error">{{ errorMessage }}</p>
    <p class="success">{{ successMessage }}</p>
    <div class="row wrap">
        <Ship v-for="ship in possibleShips" @select="select" :ship=ship :key=ship.symbol :selected="ship.symbol == selected"></Ship>
    </div>

    <div class="container row wrap">
        <Good v-for="good in market.tradeGoods" @purchase="PurchaseGood" :item=good :key=good.symbol></Good>
    </div>
    

  </main>
</template>

<style scoped>

.page-header {
    text-align: center;
}

.container > * {
    margin: 10px;
    background-color: var(--primary);
    border-radius: 10px;
    padding: 10px;
}

</style>
