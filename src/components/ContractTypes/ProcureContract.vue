<script setup>
import Item from "./ProcureItem.vue";

const props = defineProps(['deliveries', 'deadline', 'payment']);
console.log(props.deliver)
</script>

<template>
        <ul>
            <Item v-for="item in props.deliveries" :deliver=item></Item>
        </ul>
        <p>Deliver By: {{ props.deadline }}</p>
        <p>Payment On Accepted: {{ props.payment.onAccepted }}</p>
        <p>Payment On Fulfilled: {{ props.payment.onFulfilled }}</p>
</template>