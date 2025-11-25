<template>
  <h1>Trang test</h1>
</template>

<script lang="ts" setup>
import type { BaseParameters } from "~/model";

const { $appServices } = useNuxtApp();

const data = ref([]);
// $appServices.items.getFeatured().then((resp) => {
//   console.log("Featured items:", resp);
// });
</script>

<style></style>
