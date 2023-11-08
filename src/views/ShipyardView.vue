<script setup>
import CheckLogin from '../components/checkLogin.vue';
import Ship from '../components/Ships/PurchaseShipComp.vue';
import axios from 'axios';
import {ref} from 'vue';

import { storeToRefs } from 'pinia';
import { useLoginStore } from '@/stores/loginToken';

const store = useLoginStore();
const {token} = storeToRefs(store);

const shipyard = ref("");

const errorMessage = ref("");
const successMessage = ref("");

const props = defineProps(['id']);

const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

function purchaseShip(shipType) 
{
    
    errorMessage.value = "";
    successMessage.value = "";
    
    console.log(shipType);
    console.log(props.id);
    let url = "https://api.spacetraders.io/v2/my/ships"
    let data = {shipType:shipType, waypointSymbol: props.id};
    axios.post(url,  data, axiosConfig)
        .then(function (response) {
            console.log(response);
            successMessage.value = "Purchased!";
            console.log(successMessage.value);
            })
            .catch(function (error) {
                console.log(error);
                errorMessage.value = error.response.data.error.message;
            }).finally(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });


}

function Getships() {
    //https://api.spacetraders.io/v2/systems/:systemSymbol/waypoints/:shipyardWaypointSymbol/shipyard

    const splitPoint = props.id.split('-');
    console.log(splitPoint);
    if(splitPoint.length == 3)
    {
        errorMessage.value = "";

        const symbol = splitPoint[0] + '-' + splitPoint[1];
        const url = 'https://api.spacetraders.io/v2/systems/' + symbol + '/waypoints/'+ props.id +'/shipyard';
        axios.get(url,  axiosConfig)
            .then(function (response) {
                console.log(response);
                shipyard.value = response.data.data;
                console.log(shipyard.value);


            })
            .catch(function (error) {
                console.log(error);
                errorMessage.value = error.response.data.error.message;
            });
    }
    else
    {
        errorMessage.value = "Invalid System!";
    }
}

Getships();

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1 class="page-header">SHIP YARD {{ props.id }}</h1>
    <p class="error">{{ errorMessage }}</p>
    <p class="success">{{ successMessage }}</p>
    <Ship v-for="ship in shipyard.ships" :ship=ship :key=ship.type @purchase-ship="purchaseShip"></Ship>

    

  </main>
</template>

<style scoped>

.page-header {
    text-align: center;
}

.error {
    text-align: center;
    color:red;
}
.sucess {
    text-align: center;
    color:green;
}


</style>
