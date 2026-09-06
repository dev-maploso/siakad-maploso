<script setup lang="ts">
defineProps<{
loading:boolean
}>()
</script>

<template>

<button
type="submit"
:disabled="loading"
>

{{ loading ? 'Sedang Masuk...' : 'Masuk' }}

</button>

</template>

<style scoped>

button{

width:100%;

padding:15px;

border:none;

border-radius:10px;

background:#2563eb;

color:white;

font-weight:600;

cursor:pointer;

transition:.2s;

}

button:hover{

background:#1d4ed8;

}

button:disabled{

opacity:.6;

}

</style>