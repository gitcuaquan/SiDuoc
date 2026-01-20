<template>
  <LayoutAuth
    :loading="loading"
    :breadcrumb="breadcrumb"
    name="Quản lý bài viết"
  >
    <template #actions>
      <button class="btn btn-primary me-2" @click="addNew">Thêm mới</button>
    </template>
    <div class="row g-3">
      <div class="col-lg-8 col-12">
        <input
          type="search"
          class="form-control"
          placeholder="Tìm kiếm..."
          v-model="keyword"
        />
      </div>
      <div class="col-lg-4">
        <select
          class="form-select"
          v-model="queryList.category"
          @change="fetchNewsList"
        >
          <option value="">Tất cả chuyên mục</option>
          <option
            v-for="option in categoryOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="col-12" v-if="listNews">
        <div class="table-responsive rounded shadow-sm">
          <table class="table table-hover align-middle mb-0 bg-white">
            <thead class="table-light">
              <tr>
                <th class="ps-3" style="width: 60px">Ảnh</th>
                <th>Tiêu đề</th>
                <th class="text-center" style="width: 100px">Trạng thái</th>
                <th style="width: 90px" class="text-nowrap">Chuyên mục</th>
                <th style="width: 90px" class="text-nowrap">Ngày tạo</th>
                <th class="text-center text-nowrap" style="width: 80px">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="value in listNews.data" :key="value._id">
                <td class="ps-3">
                  <img
                    :src="value.thumbnail || '/images/image-error.svg'"
                    alt="thumbnail"
                    class="rounded"
                    style="width: 40px; height: 40px; object-fit: cover"
                  />
                </td>
                <td>
                  <div class="fw-medium">
                    <small>{{ textTruncate(value.title, 55) }}</small>
                  </div>
                  <small class="text-muted">
                    <NuxtLink
                      v-if="value.category != 'policy'"
                      :to="`/${value.category}/${value.slug}`"
                      class="text-decoration-none"
                    >
                      {{ textTruncate(value.slug, 35) }}
                    </NuxtLink>
                  </small>
                </td>
                <td class="text-center">
                  <span
                    class="badge rounded-pill"
                    :class="value.public ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ value.public ? "Hiện" : "Ẩn" }}
                  </span>
                  <br v-if="value.show_in_home" />
                  <span
                    v-if="value.show_in_home"
                    class="badge rounded-pill bg-info mt-1"
                  >
                    Trang chủ
                  </span>
                </td>
                <td>
                  <small>{{
                    categoryOptions.find(
                      (option) => option.value === value.category,
                    )?.label
                  }}</small>
                </td>
                <td>
                  <small>{{ formatDate(value.created_at) }}</small>
                </td>
                <td class="text-center">
                  <div class="d-flex gap-2">
                    <button
                      @click="editNews(value._id)"
                      class="btn btn-sm btn-outline-primary"
                      title="Sửa"
                    >
                      <Pencil :size="14" />
                    </button>
                    <button
                      @click="deleteNews(value._id)"
                      class="btn btn-sm btn-outline-danger"
                      title="Xóa"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3" v-if="listNews">
          <SharedModulePagination
            :pagination="listNews.meta"
            @page-change="pageChanged"
          />
        </div>
      </div>
    </div>
  </LayoutAuth>
  <ClientOnly>
    <AuthModalActNews
      :edit-id="editId"
      v-if="showModal"
      @close="showModal = false"
      @created="fetchNewsList"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { ProjectConfig } from "~/model";
definePageMeta({
  middleware: "auth",
});

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tài khoản", to: "/auth" },
  { label: "Quản lý tin tức" },
]);

const keyword = useDebouncedRef("", 500);
const loading = ref(true);
const showModal = ref(false);
const editId = ref<string | undefined>(undefined);
const listNews = ref<any>();

const categoryOptions = [
  { value: "news", label: "Tin tức" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "policy", label: "Chính sách" },
];

const queryList = ref({
  page: 1,
  limit: 10,
  category: "",
  keyword: "",
});

watch(
  () => keyword.value,
  (newVal) => {
    queryList.value.keyword = newVal;
    fetchNewsList();
  },
);
async function fetchNewsList() {
  loading.value = true;
  try {
    const rsData = await $fetch("/api/post/list", {
      query: {
        ...queryList.value,
      },
    });
    listNews.value = rsData;
  } catch (error) {
    console.error("Error fetching news list:", error);
  } finally {
    loading.value = false;
  }
}

function pageChanged(page: number) {
  queryList.value.page = page;
  fetchNewsList();
}

function addNew() {
  editId.value = undefined; // Clear editId để form trống
  showModal.value = true;
}

function editNews(id: string) {
  editId.value = id;
  showModal.value = true;
}
async function deleteNews(id: string) {
  if (confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) {
    try {
      await $fetch(`/api/post/${id}`, {
        //@ts-ignore
        method: "DELETE",
      });
      useToast().success("Xóa tin tức thành công.");
      fetchNewsList();
    } catch (error) {
      console.error("Error deleting news:", error);
      useToast().error("Xóa tin tức thất bại.");
    }
  }
}
onMounted(() => {
  fetchNewsList();
});
</script>

<style scoped>
.sticky-top {
  top: 80px;
  z-index: 0 !important;
}

@media screen and (min-width: 992px) {
  .w-custom {
    width: 440px;
  }
}
</style>
