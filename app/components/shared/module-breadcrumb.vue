<template>
  <div class="bg-custom">
    <div class="container py-3">
      <div class="d-flex fw-bold flex-nowrap gap-2 align-items-center">
        <NuxtLink class="text-decoration-none text-small" to="/">
          <div class="d-flex align-items-center text-nowrap gap-1">
            <Home :size="16" /> Trang Chủ
          </div>
        </NuxtLink>
        <span class="text-muted">
          <ChevronRight :size="16" :stroke-width="1.5" />
        </span>
        <template v-for="(value, index) in data" :key="value.label">
          <span v-if="value.to">
            <NuxtLink class="text-decoration-none text-capitalize text-small " :to="value.to">
              {{ value.label }}
            </NuxtLink>
          </span>
          <span v-else class="text-muted text-capitalize text-small ">{{ value.label }}</span>
          <ChevronRight :size="16" :stroke-width="1.5" v-if="index < (data?.length || 0) - 1" />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ProjectConfig } from "~/model";
  const props = defineProps({
    data: Array as () => ProjectConfig.BreadcrumbItem[],
  });
</script>
<style scoped>
  .breadcrumb * {
    font-size: 14px;
  }

  .bg-custom {
    background-color: #e9f0ec;
  }

  .text-small {
    font-size: 0.875rem;
  }
</style>
