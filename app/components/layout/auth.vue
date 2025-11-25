<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <div class="row py-3 g-3">
      <div class="col-lg-3 h-100">
        <LayoutAuthSiderbar class="sticky-top" style="z-index: 0" />
      </div>
      <div class="col-lg-9 position-relative" style="min-height: 60vh">
        <div
          v-if="loading"
          class="position-absolute w-100 h-100 top-0 end-0 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style="backdrop-filter: blur(3px); z-index: 9999"
        >
          <UiLoading />
        </div>
        <div class="d-flex flex-wrap ">
          <h2 class="text-capitalize mb-3">
            {{ props.name }}
          </h2>
          <div class="ms-lg-auto mb-lg-0 mb-3">
            <slot name="actions"> </slot>
          </div>
        </div>
        <slot> mặc định </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { ProjectConfig } from "~/model";

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: "auth layout",
  },
  breadcrumb: {
    type: Array as PropType<Array<ProjectConfig.BreadcrumbItem>>,
    required: false,
    default: () => [],
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style></style>
