<template>
  <div>
    <div class="modal fade" id="modal-discount" tabindex="-1">
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="mb-0">Chương trình khuyến mãi</h5>
            <button
              data-bs-dismiss="modal"
              class="btn btn-light ms-auto btn-sm rounded-circle px-1 shadow-sm"
            >
              <X :stroke-width="1" />
            </button>
          </div>
          <div class="modal-body" style="min-height: 30vh">
            <div class="row row-cols-1 row-cols-md-2 g-3 mb-3">
              <div v-for="value in props.listDiscount?.data" class="col">
                <!-- {{ value }} -->
                <SharedModuleCoupon :coupon="(value as DiscountItem)" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button data-bs-dismiss="modal" class="btn btn-outline-secondary">
              Đóng
            </button>
            <button data-bs-dismiss="modal"  class="btn btn-primary">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Modal } from "bootstrap";
import type { BaseResponse } from "~/model";
import type { DiscountItem } from "~/model/discount";

const props = defineProps<{
  listDiscount?: BaseResponse<DiscountItem>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
const modalInstance = ref<Modal | null>(null);

function initModal() {
  const modal = document.getElementById("modal-discount");
  modalInstance.value = new Modal(modal!, {
    backdrop: "static",
    keyboard: false,
  });
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}

onMounted(() => {
  initModal();
});
</script>

<style scoped></style>
