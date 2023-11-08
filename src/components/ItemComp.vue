<script setup>
import {ref, watch} from 'vue'
    const props = defineProps(['item']);

    const amount = ref(0);

watch(amount, () => {
    if(amount.value < 0 ) amount.value = 0;

    if(amount.value > props.item.units) amount.value = props.item.units;

})

</script>

<template>
    <div class="itemContainer">
        <p>{{ props.item.name }} x{{ props.item.units }}</p>
        <button type="button" @click="amount--">-</button>
        <input v-model="amount" placeholder=0>
        <button type="button" @click="amount++">+</button>
        <button type="button" @click="() => {$emit('sell', props.item.symbol, amount); amount = 0}">SELL</button>
        <button type="button" @click="() => {$emit('deliver', props.item.symbol, amount); amount = 0}">DELIVER</button>
    </div>
</template>

<style scoped>



</style>