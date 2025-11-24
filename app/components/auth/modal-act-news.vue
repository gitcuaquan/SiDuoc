<template>
  <div class="modal fade" id="modal-news" tabindex="-1">
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.detail ? "Chi tiết" : "Tạo" }} Bài viết
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-lg-9">
              <div class="mb-3">
                <label for="title" class="form-label">Tiêu đề bài viết</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newsObject.title"
                  id="title"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">
                  Nội dung bài viết
                </label>
                <shared-editor v-model="newsObject.content" />
              </div>
              <div>
                <label for="seoContent" class="form-label">Nội dung SEO</label>
                <input
                  type="text"
                  class="form-control"
                  id="seoContent"
                  v-model="newsObject.seo_content"
                  placeholder="Nhập nội dung SEO"
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label for="category" class="form-label">
                  Chuyên mục hiển thị
                </label>
                <select
                  v-model="newsObject.category"
                  id="category"
                  class="form-select"
                >
                  <option value="news">Tin tức</option>
                  <option value="promotion">Khuyến mãi</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label"> Ảnh đại diện bài viết </label>
                <shared-module-upload />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary border-0"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
          <button
            type="button"
            @click="createNews"
            class="btn btn-primary border-0 me-3"
          >
            Tạo bài viết
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "bootstrap";
import type { News } from "~/model/news";

const modalInstance = ref<Modal | null>(null);
const { $bootstrap } = useNuxtApp();

const emit = defineEmits(["close"]);
const props = defineProps<{
  detail?: boolean;
}>();
const newsObject = ref<News>({
  id: "",
  title: "",
  content: "",
  seo_content: "",
  category: "news",
  created_at: new Date(),
  updated_at: new Date(),
});

onMounted(() => {
  initModal();
});

function initModal() {
  const modal = document.getElementById("modal-news");
  modalInstance.value = new $bootstrap.Modal(modal!);
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}

async function createNews() {
  try {
    await $fetch("/api/post", {
      method: "POST",
      body: newsObject.value,
    });
    useToast().success("Tạo bài viết thành công.");
    modalInstance.value?.hide();
  } catch (error) {
    useToast().error("Có lỗi xảy ra khi tạo bài viết.");
  }
}
</script>

<style></style>
