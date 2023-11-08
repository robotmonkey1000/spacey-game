<script setup>
import {ref, watch} from 'vue'
    const props = defineProps(['item']);

    const amount = ref(0);

watch(amount, () => {
    amount.value = Number(amount.value);

    if(amount.value < 0 ) amount.value = 0;

    if(amount.value > props.item.tradeVolume) amount.value = props.item.tradeVolume;

})

</script>

<template>
    <div class="itemContainer">
        <p>{{ props.item.symbol }} x{{ props.item.tradeVolume }}</p>
        <p>Price: {{ props.item.purchasePrice }}</p>
        <p>Total: {{ props.item.purchasePrice * amount }}</p>
        <button type="button" @click="amount--">-</button>
        <input v-model="amount" placeholder=0>
        <button type="button" @click="amount++">+</button>
        <button type="button" @click="$emit('purchase', props.item.symbol, amount)">BUY</button>
    </div>
</template>

<style scoped>



</style>