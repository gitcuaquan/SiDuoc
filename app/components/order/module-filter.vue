<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasFilter" aria-labelledby="offcanvasLabel">
    <div class="offcanvas-header py-2 shadow-sm">
      <div class="offcanvas-title text-uppercase text-primary" id="offcanvasLabel">
        Bộ lọc mở rộng
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="mb-3" v-for="(value, name, nhIndex) in listNhomVatTuGrouped" :key="nhIndex">
        <h6 class="text-capitalize fw-bold">{{ name }}</h6>
        <template v-for="nhom in value">
          <div class="form-check w-100 ">
            <input class="form-check-input" type="checkbox" :checked="listFilter?.some(
              (item) => item.ma_nh === nhom.ma_nh && item.loai_nh === nhom.loai_nh
            )" @input="toggleItemInList(nhom)" :name="`nhom-vat-tu`" :id="`radio-${nhIndex}-${nhom.ma_nh}`" />
            <label class="form-check-label fw-light" :for="`radio-${nhIndex}-${nhom.ma_nh}`">
              <small> {{ nhom.ten_nh }}</small>
            </label>
          </div>
        </template>
      </div>
    </div>
    <div class="offcanvas-footer p-2">
      <button type="button" class="btn btn-primary w-100" @click="$emit('apply')" data-bs-dismiss="offcanvas">
        Áp dụng bộ lọc
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Offcanvas } from "bootstrap";
  import { BodyFilter, Item } from "~/model";
  const { $appServices } = useNuxtApp();
  const offcanvasInstance = ref<Offcanvas | null>(null);

  const { toggleItemInList, listFilter } = useFilter();

  const props = defineProps<{
    show: boolean;
  }>();

  const emits = defineEmits<{
    (e: "close"): void;
    (e: "apply"): void;
  }>();
  const loaiNhomVatTuOptions = [
    { value: Item.LoaiNhomVatTu.NguonGoc, label: "Lọc theo nguồn gốc" },
    { value: Item.LoaiNhomVatTu.PhanLoai, label: "Lọc theo phân loại" },
    { value: Item.LoaiNhomVatTu.PhanNhom, label: "Lọc theo phân nhóm" },
    { value: Item.LoaiNhomVatTu.CongDung, label: "Lọc theo công dụng" }
  ];

  const filterNhomVt = ref(
    new BodyFilter<Item.NhomVatTu>({
      pageIndex: 1,
      pageSize: 1000,
    })
  );

  const listNhomVatTu = ref<Array<Item.NhomVatTu>>([]);

  const listNhomVatTuGrouped = computed(() => {
    const grouped: Record<string, Array<Item.NhomVatTu>> = {};
    for (const option of loaiNhomVatTuOptions) {
      grouped[option.label] = listNhomVatTu.value.filter(
        (nhom) => nhom.loai_nh === option.value
      );
    }
    return grouped;
  });

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
    getNhomVatTu();
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
  async function getNhomVatTu() {
    try {
      const response = await $appServices.items.getNhomVatTu<Item.NhomVatTu>(
        filterNhomVt.value
      );
      listNhomVatTu.value = response.getData || [];
    } catch (error) {
      console.error("Error fetching Nhom Vat Tu:", error);
    }
  }

</script>

<style></style>
