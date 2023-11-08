<script setup>
import CheckLogin from "../components/checkLogin.vue";
import Stat from "../components/StatComp.vue";
import axios from 'axios';
import {ref} from 'vue'

import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginToken'

const store = useLoginStore();
const {token} = storeToRefs(store);


const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

const agentInfo = ref(null);
function GetAgentInfo()
{
    axios.get('https://api.spacetraders.io/v2/my/agent',  axiosConfig)
            .then(function (response) {
                console.log(response);
                agentInfo.value = response.data.data;
            })
            .catch(function (error) {
                console.log(error);
            });

}


if(token.value != null) GetAgentInfo();

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1>Agent Info</h1>
    <div v-if="agentInfo" class="agentDiv">
        <Stat src="../assets/user.svg" :value=agentInfo.symbol></Stat>
        <Stat src="../assets/dollar.svg" :value=agentInfo.credits></Stat>
        <Stat src="../assets/home.svg" :value=agentInfo.headquarters></Stat>
        <Stat src="../assets/faction.svg" :value=agentInfo.startingFaction></Stat>
    </div>


  </main>
</template>

<style scoped>


</style>