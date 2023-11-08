<script setup>
import CheckLogin from '../components/checkLogin.vue';
import Trait from '../components/TraitComp.vue';
import axios from 'axios';
import {ref} from 'vue';

import { storeToRefs } from 'pinia';
import { useLoginStore } from '@/stores/loginToken';

const store = useLoginStore();
const {token} = storeToRefs(store);

const waypoint = ref("");
const errorMessage = ref("");

const axiosConfig = {
    headers: {
        Authorization: "Bearer " + token.value
    }
}

const waypointRef = ref(null);

const traits = ref([]);

function submitWaypoint() {
    if(waypoint.value !== "")
    {
        errorMessage.value = "";
        GetWaypointInfo();
    }
    else
    {
        errorMessage.value = "Invalid Waypoint!";
    }
}

function GetWaypointInfo() {
    const splitPoint = waypoint.value.split('-');
    console.log(splitPoint);
    if(splitPoint.length == 3)
    {
        errorMessage.value = "";

        const symbol = splitPoint[0] + '-' + splitPoint[1];
        const url = 'https://api.spacetraders.io/v2/systems/' + symbol + '/waypoints/' + waypoint.value;
        // 'https://api.spacetraders.io/v2/systems/:systemSymbol/waypoints/:waypointSymbol'
        axios.get(url,  axiosConfig)
            .then(function (response) {
                console.log(response);
                waypointRef.value = response.data.data;
                console.log(waypointRef.value);

                traits.value = response.data.data.traits;
            })
            .catch(function (error) {
                console.log(error);
                errorMessage.value = error.response.data.error.message;
            });
    }
    else
    {
        errorMessage.value = "Invalid Waypoint!";
    }

    

}

</script>

<template>
  <main>
    <CheckLogin></CheckLogin>
    <div class="waypointSection">
        <div class="searchContainer">
            <h1>Waypoint Info</h1>

            <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
            <div class="waypointForm">
                <input v-model="waypoint" placeholder="waypoint">
                <button @click="submitWaypoint">SEARCH</button>
            </div>

        </div>

        <div v-if="waypointRef" class="waypointInfo">
            <div class="info">
                <h2>Info</h2>
                <p>Faction: {{ waypointRef.faction.symbol}}</p>
                <p>Type: {{ waypointRef.type }}</p>
                <p>Location: {{ waypointRef.x }},{{ waypointRef.y }}</p>
            </div>
            <div class="traits">
                <h2>Traits</h2>
                <Trait v-for="trait in traits" :key=trait.symbol :name=trait.name :desc=trait.description></Trait>
            </div>

            <div class="orbitals">
                <h2 v-if="waypointRef.orbitals.length > 0">Orbitals</h2>
                <h2 v-if="waypointRef.orbits">Orbits</h2>
                <p v-for="orbital in waypointRef.orbitals" :key=orbital.symbol>{{orbital.symbol}}</p>
                <p v-if="waypointRef.orbits">{{ waypointRef.orbits }}</p>
            </div>
        </div>
    </div>

  </main>
</template>

<style scoped>

.waypointInfo {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
}

.waypointInfo > * {
    padding: 10px;
}
.searchContainer {
    display: flex;
    flex-flow: column wrap;
    align-content: center;
    text-align: center;
}

.waypointForm > * {
    margin: 0.5rem 0.5rem;
    padding: 0.25rem 0.5rem;

    border-radius: 10px;
    border: solid #fee9b4;

    flex-grow: 1;
}

.waypointForm button {
    background-color: #fc6d45;
    flex-shrink: 2;
    flex-grow: 0;
}

.waypointForm button:hover {
    background-color: #fee9b4;
}

</style>
