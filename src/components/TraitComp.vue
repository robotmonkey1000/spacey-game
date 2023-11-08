<script setup>
const props = defineProps(['name', 'desc']);

</script>

<template>
    <div class="trait">
        <h3>{{ props.name }}</h3>
        <button v-if="props.name == 'Shipyard'" @click="$emit('GoToShipyard')">Go</button>
        <button v-if="props.name == 'Marketplace'" @click="$emit('GoToMarket')">Go</button>
        <p>{{ props.desc }}</p>
    </div>
</template>
