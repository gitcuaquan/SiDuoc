<template>
  <div></div>
</template>

<script lang="ts" setup>
import type { PhanLoaiVT } from '~/model/item/ITemsTapmed';

const { $appServices } = useNuxtApp();

onMounted(async () => {
  const res = await $appServices.items.getPhanNhomVt<PhanLoaiVT>();
  console.log('res', res);
});
</script>

<style></style>
