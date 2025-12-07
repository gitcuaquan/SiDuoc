<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.detail ? "Chi tiết" : "Tạo" }} khiếu nại
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="ticket-id" class="form-label">Vấn đề của bạn</label>
            <div class="dropdown dropdown-center">
              <button
                data-bs-auto-close="outside"
                class="btn btn-outline-secondary d-flex justify-content-between align-items-center w-100 text-start"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{
                  issueTypeSelected.length
                    ? issueTypeSelected.length + " vấn đề đã chọn"
                    : "Chọn loại khiếu nại"
                }}
                <chevron-down />
              </button>
              <div
                class="dropdown-menu w-100"
                style="max-height: 200px; overflow-y: auto"
              >
                <ul class="list-unstyled w-100">
                  <li v-for="(value, index) in issueTypes">
                    <a class="dropdown-item" href="#">
                      <input
                        type="checkbox"
                        :id="index + 'value'"
                        v-model="value.checked"
                        class="form-check-input me-2"
                      />
                      <label :for="index + 'value'"> {{ value.label }}</label>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="issue" class="form-label">Nội dung khiếu nại</label>
            <textarea
              class="form-control"
              id="issue"
              v-model="bodyPost.yk_kh"
              rows="3"
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            ></textarea>
          </div>
          <div class="mb-3" v-if="!props.detail">
            <label for="attachment" class="form-label">
              Tệp đính kèm (nếu có)
            </label>
            <input
              class="form-control"
              type="file"
              accept=".png,.jpg,.jpeg"
              id="attachment"
              multiple
            />
          </div>
          <div class="mb-3" v-else>
            <label for="attachment" class="form-label"> Tệp đính kèm </label>
            <div class="row g-2">
              <div class="col-lg-3 col-6 mb-3" v-for="n in 4" :key="n">
                <div class="border rounded-3 p-2 mb-2">
                  <img
                    src="https://placehold.co/800x800/000000/5682B1.png"
                    alt="Attachment"
                    class="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="!props.detail">
          <button
            type="button"
            class="btn btn-outline-secondary border-0"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
          <button
            type="button"
            @click="createTicket"
            class="btn btn-success border-0 me-3"
          >
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
const { $bootstrap, $appServices } = useNuxtApp();

const issueTypes = ref([
  { key: "hl_yn", label: "Hàng bị lỗi", checked: false },
  { key: "ktc_yn", label: "Không trả cước", checked: false },
  { key: "gnh_yn", label: "Giao nhầm hàng", checked: false },
  { key: "tth_yn", label: "Thừa thiếu hàng", checked: false },
  { key: "kng_yn", label: "Khiếu nại giá", checked: false },
  { key: "dthh_yn", label: "Đổi trả hàng hóa", checked: false },
  { key: "hdgkb_yn", label: "Hàng Date gần không báo", checked: false },
  { key: "vcc_yn", label: "Vận chuyển chậm", checked: false },
  { key: "vdk_yn", label: "Vấn đề khác", checked: false },
]);

const issueTypeSelected = computed(() => {
  return issueTypes.value.filter((type) => type.checked);
});
const emit = defineEmits(["close"]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  detail: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const bodyPost = ref({
  stt_rec: props.id,
  yk_kh: "",
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

async function createTicket() {
try {
  const payload: Record<string, any> = {
    ...bodyPost.value,
    ph_kn: null,
    ngay_ct: new Date().toISOString(),
  };
  
  issueTypes.value.forEach(type => {
    payload[type.key] = type.checked;
  });
  
  const response = await $appServices.order.createTicket(payload);
  useToast().success("Tạo khiếu nại thành công");
  modalInstance.value?.hide();
} catch (error) {
  console.error("Error creating ticket:", error);
}
}
</script>

<style></style>
