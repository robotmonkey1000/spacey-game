<script setup>
const props = defineProps(['deliver']);
console.log(props.deliver)

</script>

<template>
    <div class="collect">
        <li>Item: {{ props.deliver.tradeSymbol }}</li>
        <ul>
            <li>Total Needed: {{ props.deliver.unitsRequired }} </li>
            <li>Total Fulfilled: {{ props.deliver.unitsFulfilled }}</li>
            <li>Destination: {{ props.deliver.destinationSymbol }}</li>
        </ul>
    </div>
</template>