<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  placeholder?: string
}>()

const model = defineModel<string>({
  required: true
})
</script>

<template>

<div class="group">

<label>{{ label }}</label>

<input
    v-model="model"
    :type="type ?? 'text'"
    :placeholder="placeholder"
/>

</div>

</template>

<style scoped>

.group{
display:flex;
flex-direction:column;
gap:8px;
margin-bottom:18px;
}

label{
font-weight:600;
font-size:.95rem;
}

input{

padding:14px;

border-radius:10px;

border:1px solid #dbe2ea;

transition:.2s;

}

input:focus{

outline:none;

border-color:#2563eb;

box-shadow:0 0 0 3px rgba(37,99,235,.15);

}

</style>