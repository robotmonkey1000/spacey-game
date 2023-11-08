<script setup>
import {ref} from 'vue';
import InventoryItem from '../ItemComp.vue'
import Waypoint from '../Location/WaypointComp.vue';
const props = defineProps(['ship', 'autoMineDisabled']);

const waypoint = ref("");

const count = ref(0);

const emit = defineEmits(['sell', 'dock', 'extract', 'travel', 'refuel', 'orbit', 'deliver', 'auto-mine'])

function Sell(symbol, amount)
{
    emit('sell', symbol, amount);
}

const contractId = ref("");
const errorMessage = ref("");
function Deliver(symbol, amount)
{
    errorMessage.value = "";
    if(contractId.value == "")
    {
        errorMessage.value = "Please enter a contract ID!"
    }
    else 
    {
        emit('deliver', symbol, amount, contractId);
    }
}
</script>

<template>
    <div class="container operations">
        <button v-if="props.ship.nav.status == 'DOCKED'"   type="button" @click="$emit('orbit',  props.ship.symbol)"> Orbit </button>
        <button v-if="props.ship.nav.status == 'DOCKED'"   type="button" @click="$emit('refuel', props.ship.symbol)"> Refuel </button>
        <button v-if="props.ship.nav.status == 'IN_ORBIT'" type="button" @click="$emit('dock',   props.ship.symbol)"> Dock </button>
        
        <button :disabled="props.ship.cooldown.remainingSeconds > 0" v-if="props.ship.nav.status == 'IN_ORBIT' && props.ship.nav.route.destination.type == 'ASTEROID_FIELD'" type="button" @click="$emit('extract', props.ship.symbol)"> {{props.ship.cooldown.remainingSeconds > 0? props.ship.cooldown.remainingSeconds: "Extract"}} </button>
        
        <input :disabled="props.autoMineDisabled" v-if="props.ship.nav.status == 'IN_ORBIT' && props.ship.nav.route.destination.type == 'ASTEROID_FIELD'" type="checkbox" id="switch" @click="e => $emit('auto-mine', props.ship.symbol, e.target.checked)"/><label v-if="props.ship.nav.status == 'IN_ORBIT' && props.ship.nav.route.destination.type == 'ASTEROID_FIELD'" for="switch" class="toggle-switch">Toggle</label>
        
        <div class="travel" v-if="props.ship.nav.status == 'IN_ORBIT'">
            <input v-model="waypoint" placeholder="waypoint">
            <button type="button" @click="$emit('travel', props.ship.symbol, waypoint)">TRAVEL</button>
        </div>

    </div>
    <div class="container">
        <div class="shipInfo">
            <h2>Information</h2>
            <p>Name: {{ props.ship.registration.name }}</p>
            <p>Role: {{ props.ship.registration.role }}</p>
            <p>Crew: {{ props.ship.crew.current }} Crew Required: {{ props.ship.crew.required }} Crew Capacity: {{ props.ship.crew.capacity }}</p>
            <p>Fuel: {{ props.ship.fuel.current }} Max Fuel: {{ props.ship.fuel.capacity }}</p>
            <p>Cargo Amount: {{ props.ship.cargo.units }} Cargo Capacity: {{ props.ship.cargo.capacity }}</p>
            <p>Current Location: <Waypoint :id=props.ship.nav.waypointSymbol> </Waypoint></p>

            <!-- Todo make this count down better -->
            <p v-if="props.ship.cooldown.remainingSeconds > 0">Cooldown: {{ props.ship.cooldown.remainingSeconds - count }}</p> 

            <p>Status: {{ props.ship.nav.status }}</p>
            <p v-if="props.ship.nav.status == 'IN_TRANSIT'">Desintation: {{ props.ship.nav.route.destination.symbol }} Arrival Time: {{ props.ship.nav.route.arrival }}</p>
        </div>
        <div class="icon-container">
            <img class="animated-icon" v-if="props.ship.nav.status == 'IN_TRANSIT'" src="../../assets/rocket.svg">

        </div>
        <div class="cargo">
            <h2>Cargo</h2>
            <div><input v-model="contractId" placeholder="Contract ID"> <span class="error">{{ errorMessage }}</span></div>
            <InventoryItem v-for="item in props.ship.cargo.inventory" :item=item :key=item.symbol @deliver="Deliver" @sell="Sell"></InventoryItem>
        </div>
    </div>
</template>

<style scoped>

@keyframes bob {
    0% {
        
        /* transform-origin: center; */
        transform: translateY(0%) rotate(90deg)  translateX(-100%);
    }
    25% {
        
        /* transform-origin: center; */
        transform: translateY(50%) rotate(135deg)  translateX(0%);
    }
    50% {
        /* transform-origin: center; */
        transform: translateY(0%) rotate(90deg) translateX(100%);
    }
    75% {
        /* transform-origin: center; */
        transform: translateY(-50%) rotate(45deg)  translateX(0%);
    }
    100% {
        /* transform-origin: center; */
        transform: translateY(0%) rotate(90deg) translateX(-100%);
    }
}

.animated-icon {
    animation-name: bob;
    animation-duration: 8s;
    animation-iteration-count: infinite;

    width: 50px;
}
.icon-container {
    align-self: center;
}

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

input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
}

label.toggle-switch {
  cursor: pointer;
  text-indent: -9999px;
  width: 80px;
  height: 40px;
  background: grey;
  display: block;
  border-radius: 40px;
  position: relative;
}

label.toggle-switch:after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 30px;
  transition: 0.6s;
}


input:checked + label.toggle-switch {
  background: #bada55;
}

input:disabled + label.toggle-switch:after{
    background: #e20343;
}
input:disabled + label.toggle-switch{
    background: #e20343;
}



input:checked + label.toggle-switch:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label.toggle-switch:active:after {
  width: 35px;
}

.error {
    color:yellow;
    font-weight: bold;
    /* background-color: rgba(0, 0, 0, 0.626); */
}

.travel {
    margin-left:auto;
    align-self: flex-end;
}

.operations {
    justify-content: flex-start;
}


.operations button {
    padding: 10px 10px;
    background-color: #fc6d45;

    border: solid #fee9b4;
    border-radius: 10px;;

    margin: 1px;
}

.operations button:disabled {
    color:rgb(224, 0, 0);
    background-color: grey;
    font-weight: bold;
}

.operations button:hover {
    background-color: #fee9b4;
}



</style>