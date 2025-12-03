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
            <div class="dropdown dropdown-center">
              <button data-bs-auto-close="outside"
                class="btn btn-outline-secondary d-flex justify-content-between align-items-center w-100 text-start"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Chọn vấn đề
                <chevron-down />
              </button>
              <ul class="dropdown-menu w-100">
                <li v-for="(value, index) in issueTypes">
                  <a class="dropdown-item" href="#">
                    <input type="checkbox" :id="index + 'value'" class="form-check-input me-2" />
                    <label :for="index + 'value'"> {{ value }}</label>
                  </a>
                </li>
              </ul>
            </div>
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
          <button type="button" class="btn btn-outline-secondary border-0" data-bs-dismiss="modal">
            Đóng
          </button>
          <button type="button" data-bs-dismiss="modal" class="btn btn-success border-0 me-3">
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

  const issueTypes = [
    "Sản phẩm bị lỗi",
    "Giao hàng chậm",
    "Sai sản phẩm, Sai số lượng",
    "Vấn đề khác",
  ];

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
