<script setup>
import CheckLogin from "../components/checkLogin.vue";
import Contract from "../components/ContractComp.vue";
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

const contractInfo = ref(null);

function AcceptContract(id)
{
    const url = 'https://api.spacetraders.io/v2/my/contracts/' + id + '/accept';
    axios.post(url, {}, axiosConfig)
    .then((response)=>
    {
        console.log(response);
        GetContractInfo();
    })
    .error((err)=> 
    {
        err.log(err);
    });
}

function GetContractInfo()
{
    axios.get('https://api.spacetraders.io/v2/my/contracts',  axiosConfig)
            .then(function (response) {
                console.log(response);
                contractInfo.value = response.data.data;
            })
            .catch(function (error) {
                error.log(error);
            });

}


if(token.value != null) GetContractInfo();

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <h1>Contracts</h1>
    <div v-if="contractInfo" class="contracts">
        <Contract v-for="c in contractInfo" :key=c.id :contract=c @accept="AcceptContract"></Contract>
    </div>


  </main>
</template>

<style scoped>


</style>