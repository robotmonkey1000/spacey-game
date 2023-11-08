<script setup>
const props = defineProps(['ship']);
</script>

<template>
    <div class="container">
        <div class="shipInfo">
            <p>Type: {{ props.ship.name }}</p>
            <p>Cost: {{ props.ship.purchasePrice }}</p>
            <p>Crew Required: {{ props.ship.crew.required }} Crew Capacity: {{ props.ship.crew.capacity }}</p>
        </div>
        <div class="purchase">
            <button type="button" @click="$emit('purchaseShip', props.ship.type)"> Purchase </button>
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

.purchase {
    display:flex;
    justify-self: stretch;
    flex-basis: auto;

    padding: 5px;
}

.purchase button {
    padding: 10px 25px;
    background-color: #fc6d45;

    border: solid #fee9b4;
    border-radius: 10px;;
}

.purchase button:hover {
    background-color: #fee9b4;
}



</style>