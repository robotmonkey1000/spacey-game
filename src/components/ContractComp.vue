<script setup>
import Procure from "./ContractTypes/ProcureContract.vue";

const props = defineProps(['contract']);

</script>

<template>
    <div class="contract">
        <h2>{{ props.contract.type }} Contract</h2>
        
        <p v-if="!props.contract.accepted">Accept By: {{ props.contract.deadlineToAccept }}</p>
        <p v-else>Accepted</p>

        <p>Expiration: {{ props.contract.expiration }}</p>
        <p>Faction: {{ props.contract.factionSymbol }}</p>

        <Procure v-if="props.contract.type == 'PROCUREMENT'" :deliveries=props.contract.terms.deliver :deadline=props.contract.terms.deadline :payment=props.contract.terms.payment></Procure>

        <p>Contract ID: {{ props.contract.id }}</p>
        <button v-if="!props.contract.accepted" @click="$emit('accept', props.contract.id)">Accept Contract</button>
    </div>
</template>

<style scoped>
.contract {
    display: flex;
    flex-flow: column wrap;
    width: 25%;
    border-radius: 20px;
    background-color: #e20343;
    padding: 20px;

}
.contract > * {
    margin: 0.5rem;
}

.contract h2 {
    text-align: center;
}

</style>
