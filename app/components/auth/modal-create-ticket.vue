<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ props.detail ? "Chi tiết" : "Tạo" }} khiếu nại</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="ticket-id" class="form-label">Vấn đề của bạn</label>
            <select name="ticket-id" id="ticket-id" class="form-select">
              <option value="" disabled selected>Chọn vấn đề</option>
              <option value="1">Sản phẩm bị lỗi</option>
              <option value="2">Giao hàng chậm</option>
              <option value="3">Nhận nhầm sản phẩm</option>
              <option value="4">Khác</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="issue" class="form-label">Nội dung khiếu nại</label>
            <textarea class="form-control" id="issue" rows="3"
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."></textarea>
          </div>
          <div class="mb-3" v-if="!props.detail">
            <label for="attachment" class="form-label">
              Tệp đính kèm (nếu có)
            </label>
            <input class="form-control" type="file" accept=".png,.jpg,.jpeg" id="attachment" multiple />
          </div>
          <div class="mb-3" v-else>
            <label for="attachment" class="form-label"> Tệp đính kèm </label>
            <div class="row g-2">
              <div class="col-lg-3 col-6 mb-3" v-for="n in 4" :key="n">
                <div class="border rounded-3 p-2 mb-2">
                  <img src="https://placehold.co/800x800/000000/5682B1.png" alt="Attachment" class="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="!props.detail">
          <button type="button" class="btn btn-sm btn-outline-secondary border-0" data-bs-dismiss="modal">
            Đóng
          </button>
          <button type="button" data-bs-dismiss="modal" class="btn btn-sm btn-success border-0 me-3">
            Tạo khiếu nại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Modal } from "bootstrap";

  const modalInstance = ref<Modal | null>(null);
  const { $bootstrap } = useNuxtApp();

  const emit = defineEmits(["close"]);
  const props = defineProps({
    detail: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  onMounted(() => {
    initModal();
  });

  function initModal() {
    const modal = document.getElementById("modal-register");
    modalInstance.value = new $bootstrap.Modal(modal!);
    modalInstance.value.show();
    modal!.addEventListener("hidden.bs.modal", () => {
      emit("close");
    });
  }
</script>

<style></style>
