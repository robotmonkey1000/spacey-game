<script setup>
import {ref} from 'vue';
import Waypoint from '../Location/WaypointComp.vue';
const props = defineProps(['ship']);

const waypoint = ref("");

const count = ref(0);


</script>

<template>
    <div class="container">
        <div class="shipInfo">
            <p>Name: {{ props.ship.registration.name }}</p>
            <p>Role: {{ props.ship.registration.role }}</p>
            <p>Crew: {{ props.ship.crew.current }} Crew Required: {{ props.ship.crew.required }} Crew Capacity: {{ props.ship.crew.capacity }}</p>
            <p>Fuel: {{ props.ship.fuel.current }} Max Fuel: {{ props.ship.fuel.capacity }}</p>
            <p>Cargo Amount: {{ props.ship.cargo.units }} Cargo Capacity: {{ props.ship.cargo.capacity }}</p>
            <p>Current Location: <Waypoint :id="props.ship.nav.waypointSymbol"></Waypoint></p>
            <!-- Todo make this count don better -->
            <p v-if="props.ship.cooldown.remainingSeconds > 0">Cooldown: {{ props.ship.cooldown.remainingSeconds - count }}</p> 

            <p>Status: {{ props.ship.nav.status }}</p>
            <p v-if="props.ship.nav.status == 'IN_TRANSIT'">Desintation: {{ props.ship.nav.route.destination.symbol }} Arrival Time: {{ props.ship.nav.route.arrival }}</p>
        </div>
        <div class="operations">
            <button v-if="props.ship.nav.status == 'DOCKED'"   type="button" @click="$emit('refuel', props.ship.symbol)"> Refuel </button>
            <button v-if="props.ship.nav.status == 'DOCKED'"   type="button" @click="$emit('orbit',  props.ship.symbol)"> Orbit </button>
            <button v-if="props.ship.nav.status == 'IN_ORBIT'" type="button" @click="$emit('dock',   props.ship.symbol)"> Dock </button>
            <button v-if="props.ship.nav.status == 'IN_ORBIT' && props.ship.nav.route.destination.type == 'ASTEROID_FIELD'" type="button" @click="$emit('extract', props.ship.symbol)"> Extract </button>
            
            <div class="travel" v-if="props.ship.nav.status == 'IN_ORBIT'">
                <input v-model="waypoint" placeholder="waypoint">
                <button type="button" @click="$emit('travel', props.ship.symbol, waypoint)">TRAVEL</button>
            </div>

            <button type="button" @click="$emit('detailed-view', props.ship.symbol)"> Detailed View </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    display:flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 1rem;
    padding: 5px 0.5rem;
    border-radius: 10px;
    background-color: #e20343;
}
.travel > * {
    margin: 3px;
}

.operations {
    display:flex;
    /* justify-self: stretch; */
    /* flex-basis: auto; */
    
    flex-flow: column;
    justify-content: center;


    padding: 5px;
}

.operations button {
    padding: 10px 10px;
    background-color: #fc6d45;

    border: solid #fee9b4;
    border-radius: 10px;;

    margin: 1px;
}

.operations button:hover {
    background-color: #fee9b4;
}



</style>