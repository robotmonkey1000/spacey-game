<script setup>
import {ref} from 'vue'
import router from '../../router';
    const props = defineProps(['id']);

function GoToSystem() {
    let split = props.id.split('-');
    let systemId = split[0] + '-' + split[1];
    router.push({name:"detailedsystem", params:{sid:systemId}});
}

function GoToWaypoint() {
    let split = props.id.split('-');
    let systemId = split[0] + '-' + split[1];
    router.push({name:"detailedwaypoint", params:{sid:systemId, wid:props.id}});
}

</script>

<template>
    <div class="waypoint">
        <p>{{ props.id }}</p>

        <button type="button" @click="GoToSystem"><img   src="../../assets/solarsystem.svg"></button>
        <button type="button" @click="GoToWaypoint"><img src="../../assets/planet.svg"></button>
    </div>
</template>

<style scoped>

.waypoint {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
}

.waypoint img {
    width: 100%;
    height: 100%;
}

.waypoint p {
    margin-right: 3px;
}

.waypoint button {
    align-self: center;
    width: 25px;
    height: 25px;

    padding: 3px;
    margin: 1px;
}


</style>