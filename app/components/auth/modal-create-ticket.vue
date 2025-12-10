<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.detailData ? "Chi tiết" : "Tạo" }} khiếu nại
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3" v-if="!props.detailData">
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
          <div v-if="props.detailData">
            <div class="mb-3">
              <label class="form-label">Các khiếu nại đã ghi nhận</label>
              <ul class="list-group list-group-flush">
                <template v-for="type in issueTypes" :key="type.key">
                  <li
                    class="list-group-item ps-0 text-danger"
                    v-if="props.detailData[type.key] == true"
                  >
                    <x-circle /> {{ type.label }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="mb-3">
            <label for="issue" class="form-label">Nội dung khiếu nại</label>
            <textarea
              v-if="!props.detailData"
              class="form-control"
              id="issue"
              v-model="bodyPost.yk_kh"
              rows="3"
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            ></textarea>
            <div v-else class="alert alert-warning">
              <small>
                {{
                  props.detailData?.yk_kh ||
                  "Khách hàng không cung cấp nội dung khiếu nại."
                }}</small
              >
            </div>
          </div>
          <div class="mb-3" v-if="props.detailData">
            <label class="form-label">Phản hồi về khếu nại</label>
            <div class="alert alert-success">
              <small>
                {{
                  props.detailData?.ph_kn ||
                  "Chưa có phản hồi nào"
                }}
              </small>
            </div>
          </div>
          <div class="mb-3" v-if="!props.detailData">
            <label for="attachment" class="form-label">
              Tệp đính kèm (nếu có)
            </label>
            <input
              class="form-control"
              type="file"
              accept=".png,.jpg,.jpeg"
              @input="fileChange"
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
        <div class="modal-footer" v-if="!props.detailData">
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
import type { PropType } from "vue";

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
const fileInput = ref<FileList | null>(null);
const emit = defineEmits(["close"]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  detailData: {
    type: Object as PropType<Record<string, any> | null>,
    required: false,
    default: null,
  },
});
function fileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    fileInput.value = files;
  }
}

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

function uploadFiles(): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    if (!fileInput.value || fileInput.value.length === 0) {
      resolve([]);
      return;
    }
    try {
      const uploadPromises: Promise<any>[] = [];
      for (let i = 0; i < fileInput.value.length; i++) {
        const file = fileInput.value.item(i);
        if (file) {
          uploadPromises.push(
            $appServices.file.uploadFile(file, {
              controllerFields: "Complaints",
              keyFields: props.id,
            }) as Promise<any>
          );
        }
      }
      const uploadedUrls = await Promise.all(uploadPromises);
      resolve(uploadedUrls);
    } catch (error) {
      reject(error);
    }
  });
}

async function createTicket() {
  try {
    const payload: Record<string, any> = {
      ...bodyPost.value,
      ph_kn: null,
      ngay_ct: new Date().toISOString(),
    };
    await uploadFiles();

    issueTypes.value.forEach((type) => {
      payload[type.key] = type.checked;
    });

    await $appServices.order.createTicket(payload);
    useToast().success("Tạo khiếu nại thành công");
    modalInstance.value?.hide();
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
}
</script>

<style></style>
