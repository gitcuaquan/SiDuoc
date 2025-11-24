<template>
  <h1>Trang test</h1>
</template>

<script lang="ts" setup>
import type { BaseParameters } from "~/model";

const { $appServices } = useNuxtApp();

const data = ref([]);
$appServices.order.listOrder().then((res) => {
  console.log("🚀 ~ res=>", res);
});
</script>

<style></style>
