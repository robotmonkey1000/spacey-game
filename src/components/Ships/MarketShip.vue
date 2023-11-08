<script setup>
import {ref} from 'vue';
const props = defineProps(['ship', 'selected']);

</script>

<template>
    <div class="container row">
        <p>{{ ship.registration.name }} {{ ship.cargo.units }} / {{ ship.cargo.capacity }}</p>
        <p v-if="selected">✔</p>
        <button type="button" @click="$emit('select', props.ship.symbol)">SELECT</button>
    </div>


</template>

<style scoped>

.container {
    background-color: var(--primary);
    border: dashed white;
    border-radius: 10px;

    margin: 10px;
    padding: 5px;
}

.container > * {
    margin-left: 10px ;
    margin-right: 10px ;
}


</style>