<template>
  <div class="dropdown dropdown-center w-100">
    <slot :selected="valueSelected">
      <button
        class="form-control w-100 d-flex justify-content-between align-items-center"
        type="button"
        data-bs-toggle="dropdown"
      >
        {{ valueSelected || "Chọn dữ liệu" }} <chevron-down />
      </button>
    </slot>
    <ul
      class="dropdown-menu w-100 py-0"
      style="max-height: 300px; overflow-y: auto"
      aria-labelledby="moduleSelectDropdown"
    >
      <li class="dropdown-item bg-white shadow-sm sticky-top">
        <input
          v-model="keyword"
          type="search"
          class="form-control form-control-sm"
          placeholder="Tìm kiếm..."
        />
      </li>
      <li v-for="(item, index) in listedData" :key="index">
        <a
          class="dropdown-item"
          @click="
            valueSelected = item;
            emits('select', item);
          "
          href="#"
        >
          <slot name="item" :item="item">
            {{ item }}
          </slot>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const keyword = ref("");

const listedData = computed(() => {
  if (!keyword.value) {
    return props.data;
  }
  return props.data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(keyword.value.toLowerCase())
  );
});
const emits = defineEmits(["select"]);

const valueSelected = ref();
</script>

<style></style>
