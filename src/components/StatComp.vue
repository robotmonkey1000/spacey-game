<script setup>
const props = defineProps(['src', 'value']);



</script>

<template>
    <div class="stat">
        <div class="imgDiv">
            <img :src=props.src>
        </div>
        <p>{{ props.value }}</p>
    </div>
</template>

<style scoped>

.stat {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    font-size: 30px;
    padding: 0.5rem;
}
.stat .imgDiv {
    display:flex;
    margin: 1rem;
}

.stat .imgDiv img {
    width:  50px;
}
</style>