<template>
  <div class="modal fade" id="modal-news" tabindex="-1">
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div
          v-if="loading"
          style="z-index: 999999"
          class="text-center position-absolute bg-blur w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
        >
          <UiLoading />
        </div>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.editId ? "Sửa" : "Tạo" }} Bài viết
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
              <div class="mb-3" v-if="newsObject.category != 'policy'">
                <label for="seoContent" class="form-label">Tiêu đề SEO</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newsObject.seo_title"
                  id="seoTitle"
                  placeholder="Nhập tiêu đề SEO bài viết"
                />
              </div>
              <div v-if="newsObject.category != 'policy'">
                <label for="seoContent" class="form-label">Nội dung SEO</label>
                <textarea
                  name="seoContent"
                  class="form-control"
                  id="seoContent"
                  rows="3"
                  placeholder="Nhập nội dung SEO bài viết"
                  v-model="newsObject.seo_content"
                ></textarea>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label"> Hiển thị cho người dùng </label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="public"
                    v-model="newsObject.public"
                  />
                  <label class="form-check-label" for="public">
                    {{ newsObject.public ? "Có hiển thị" : "Không hiển thị" }}
                  </label>
                </div>
              </div>
              <div class="mb-3" v-if="newsObject.category != 'policy'">
                <label class="form-label"> Hiển thị lên trang chủ </label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="showInHome"
                    v-model="newsObject.show_in_home"
                  />
                  <label class="form-check-label" for="showInHome">
                    {{
                      newsObject.show_in_home ? "Có hiển thị" : "Không hiển thị"
                    }}
                  </label>
                </div>
              </div>
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
                  <option value="policy">Chính sách</option>
                </select>
              </div>
              <div class="mb-3" v-if="newsObject.category != 'policy'">
                <label class="form-label"> Ảnh đại diện bài viết </label>
                <shared-module-upload
                  :ratio="'16x9'"
                  @change="onChangeFile"
                  :imageUrl="newsObject.thumbnail"
                  :placeholder="'Tải ảnh đại diện bài viết (.jpg, .png) tỷ lệ 16x9'"
                />
              </div>
              <div v-if="newsObject.category != 'policy'">
                <label for="seoKeywords" class="form-label">
                  Từ khóa SEO (ngăn cách bởi dấu ,)
                </label>
                <textarea
                  class="form-control"
                  v-model="newsObject.seo_keywords"
                  id="seoKeywords"
                  rows="5"
                  placeholder="Nhập từ khóa SEO"
                ></textarea>
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
            v-if="!props.editId"
            @click="createNews"
            class="btn btn-primary border-0 me-3"
          >
            Tạo bài viết
          </button>
          <button
            type="button"
            v-if="props.editId"
            @click="updateNews"
            class="btn btn-primary border-0 me-3"
          >
            Cập nhật bài viết
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "bootstrap";
import type { News } from "~/model/news";
import BaseService from "~/services/BaseService";

const modalInstance = ref<Modal | null>(null);
const { $bootstrap, $appServices } = useNuxtApp();
const emit = defineEmits(["close", "created"]);
const props = defineProps<{
  editId?: string;
}>();
const loading = ref(false);
const fileUpload = ref<File | null>(null);
const newsObject = ref<News>({
  id: "",
  title: "",
  content: "",
  slug: "",
  seo_content: "",
  thumbnail: "",
  category: "news",
  created_at: new Date(),
  updated_at: new Date(),
  show_in_home: false,
  public: true,
  seo_title: "",
  seo_keywords: "",
});

onMounted(() => {
  initModal();
  if (props.editId) {
    // Fetch existing news data for editing
    $fetch<News>(`/api/post/${props.editId}`).then((data) => {
      newsObject.value = data;
    });
  }
});

function initModal() {
  const modal = document.getElementById("modal-news");
  modalInstance.value = new $bootstrap.Modal(modal!);
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}
async function updateNews() {
  try {
    loading.value = true;
    await uploadImage();
    await $fetch(`/api/post/${props.editId}`, {
      //@ts-ignore
      method: "PUT",
      body: newsObject.value,
    });
    useToast().success("Cập nhật bài viết thành công.");
    modalInstance.value?.hide();
    emit("created");
  } catch (error) {
    useToast().error("Có lỗi xảy ra khi cập nhật bài viết.");
  } finally {
    loading.value = false;
  }
}

async function createNews() {
  try {
    loading.value = true;
    await uploadImage();
    await $fetch("/api/post", {
      method: "POST",
      body: newsObject.value,
    });
    useToast().success("Tạo bài viết thành công.");
    modalInstance.value?.hide();
    emit("created");
  } catch (error) {
    useToast().error("Có lỗi xảy ra khi tạo bài viết.");
  } finally {
    loading.value = false;
  }
}

async function uploadImage() {
  if (!fileUpload.value) return;
  const rsData = await $appServices.file.uploadFile(fileUpload.value);
  newsObject.value.thumbnail = (rsData as any).fileUrl;
}
function onChangeFile(file: File | null) {
  fileUpload.value = file;
}
</script>

<style scoped>
.form-label {
  font-weight: 800;
  font-size: 0.875rem;
}
</style>
