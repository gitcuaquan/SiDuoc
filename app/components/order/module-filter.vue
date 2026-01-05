<template>
  <div
    class="offcanvas offcanvas-start"
    tabindex="-1"
    id="offcanvasFilter"
    aria-labelledby="offcanvasLabel"
  >
    <div class="offcanvas-header py-2 shadow-sm">
      <div
        class="offcanvas-title text-uppercase text-primary"
        id="offcanvasLabel"
      >
        Bộ lọc mở rộng
      </div>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <label class="form-label fw-bold"> Lọc theo phân loại </label>
      <div class="d-flex flex-wrap gap-2">
        <input
          type="radio"
          class="btn-check"
          v-model="phanLoaiVtSelected"
          :value="null"
          name="phan-loai-vt-mb"
          id="plvt-mb-all"
          autocomplete="off"
        />
        <label
          class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
          for="plvt-mb-all"
        >
          Tất cả loại thuốc
        </label>

        <template v-for="value in phanLoaiVt" :key="`mb-${value.ma_plvt}`">
          <input
            type="radio"
            class="btn-check"
            v-model="phanLoaiVtSelected"
            :value="value"
            name="phan-loai-vt-mb"
            :id="`plvt-mb-${value.ma_plvt}`"
            autocomplete="off"
          />
          <label
            class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
            :for="`plvt-mb-${value.ma_plvt}`"
          >
            {{ value.ten_plvt }}
          </label>
        </template>
      </div>

      <label class="form-label fw-bold mt-3"> Lọc theo phân nhóm </label>
      <ul class="list-unstyled">
        <li class="mb-1">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              v-model="phanNhomVtSelected"
              :value="null"
              name="nhom-vat-tu-mb"
              id="nhom-vt-mb-all"
            />
            <label class="form-check-label" for="nhom-vt-mb-all">
              <small> Tất cả nhóm thuốc</small>
            </label>
          </div>
        </li>

        <li
          v-for="value in phanNhomVt"
          :key="`mb-pn-${value.ma_pnvt}`"
          class="mb-1"
        >
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              v-model="phanNhomVtSelected"
              :value="value"
              name="nhom-vat-tu-mb"
              :id="`nhom-vt-mb-${value.ma_pnvt}`"
            />
            <label
              class="form-check-label"
              :for="`nhom-vt-mb-${value.ma_pnvt}`"
            >
              <small> {{ value.ten_pnvt }}</small>
            </label>
          </div>
        </li>
      </ul>
    </div>
    <div class="offcanvas-footer p-2">
      <button
        type="button"
        class="btn btn-primary w-100"
        @click="$emit('apply',{ phanLoaiVtSelected, phanNhomVtSelected })"
        data-bs-dismiss="offcanvas"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Offcanvas } from "bootstrap";
import type { PhanLoaiVT, PhanNhomVT } from "~/model/item/ITemsTapmed";
const { $appServices } = useNuxtApp();
const offcanvasInstance = ref<Offcanvas | null>(null);


const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  (e: "close"): void;
  (e: "apply",{
    phanLoaiVtSelected,
    phanNhomVtSelected,
  }: {
    phanLoaiVtSelected: PhanLoaiVT;
    phanNhomVtSelected: PhanNhomVT;
  }): void;
}>();
// const loaiNhomVatTuOptions = [
//   { value: Item.LoaiNhomVatTu.NguonGoc, label: "Lọc theo nguồn gốc" },
//   { value: Item.LoaiNhomVatTu.PhanLoai, label: "Lọc theo phân loại" },
//   { value: Item.LoaiNhomVatTu.PhanNhom, label: "Lọc theo phân nhóm" },
//   { value: Item.LoaiNhomVatTu.CongDung, label: "Lọc theo công dụng" },
// ];

// const filterNhomVt = ref(
//   new BodyFilter<Item.NhomVatTu>({
//     pageIndex: 1,
//     pageSize: 1000,
//   })
// );
const phanLoaiVt = ref<Array<PhanLoaiVT>>([]);
const phanNhomVt = ref<Array<PhanNhomVT>>([]);
const phanLoaiVtSelected = ref<any>(null);
const phanNhomVtSelected = ref<any>(null);
// const listNhomVatTu = ref<Array<Item.NhomVatTu>>([]);

// const listNhomVatTuGrouped = computed(() => {
//   const grouped: Record<string, Array<Item.NhomVatTu>> = {};
//   for (const option of loaiNhomVatTuOptions) {
//     grouped[option.label] = listNhomVatTu.value.filter(
//       (nhom) => nhom.loai_nh === option.value
//     );
//   }
//   return grouped;
// });

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      offcanvasInstance.value?.show();
    } else {
      offcanvasInstance.value?.hide();
    }
  }
);
onMounted(() => {
  initOffcanvas();
  // getNhomVatTu();
  getPhanNhomVt();
  getPhanLoaiVt();
});

function initOffcanvas() {
  const offcanvasElement = document.getElementById("offcanvasFilter");
  if (offcanvasElement) {
    offcanvasInstance.value = new Offcanvas(offcanvasElement);
    offcanvasElement.addEventListener("hidden.bs.offcanvas", () => {
      emits("close");
    });
  }
}
// async function getNhomVatTu() {
//   try {
//     const response = await $appServices.items.getNhomVatTu<Item.NhomVatTu>(
//       filterNhomVt.value
//     );
//     listNhomVatTu.value = response.getData || [];
//   } catch (error) {
//     console.error("Error fetching Nhom Vat Tu:", error);
//   }
// }
async function getPhanNhomVt() {
  try {
    const response = await $appServices.items.getPhanNhomVt<PhanNhomVT>();
    phanNhomVt.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Phan Nhom VT:", error);
  }
}
async function getPhanLoaiVt() {
  try {
    const response = await $appServices.items.getPhanLoaiVt<PhanLoaiVT>();
    phanLoaiVt.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Phan Loai VT:", error);
  }
}
</script>

<style scoped>
.btn-check:checked + .btn,
:not(.btn-check) + .btn:active,
.btn:first-child:active,
.btn.active,
.btn.show {
  color: white !important;
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
}
.badge {
  color: var(--bs-primary) !important;
}
</style>
