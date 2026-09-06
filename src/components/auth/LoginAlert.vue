<script setup lang="ts">
defineProps<{
message:string
}>()
</script>

<template>

<div
v-if="message"
class="alert"
>

{{ message }}

</div>

</template>

<style scoped>

.alert{

background:#fef2f2;

color:#dc2626;

padding:14px;

border-radius:10px;

margin-bottom:20px;

}

</style>