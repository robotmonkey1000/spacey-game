<script setup>
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginToken'
import router from '../router'

const store = useLoginStore();
const {token} = storeToRefs(store);

if(token.value == null) router.push('/login');
</script>

<template>
    <!-- <p>{{ token }}</p> //TODO stop rendering this -->
    <p></p>
</template>