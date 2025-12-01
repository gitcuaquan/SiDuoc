<template>
  <LayoutAuth
    :loading="loading"
    :breadcrumb="breadcrumb"
    :is-empty="listNews?.data?.length === 0"
    name="Quản lý tin tức"
  >
    <template #actions>
      <button class="btn btn-primary me-2" @click="showModal = true">
        Thêm mới
      </button>
    </template>
    <div v-if="listNews" class="row g-3">
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
      <div class="col-12">
        <div
          class="cart-header table-fake d-none border w-100 d-lg-table-row bg-light fw-semibold"
        >
          <span class="d-lg-table-cell text-nowrap p-3 py-2">Ảnh đại diện</span>
          <span class="d-lg-table-cell text-nowrap p-3 py-2">Tiêu đề</span>
          <span class="d-lg-table-cell text-nowrap p-3 py-2">Chuyên mục</span>
          <span
            class="d-lg-table-cell text-nowrap p-3 py-2 text-end text-nowrap"
          >
            Ngày tạo
          </span>
          <span
            class="d-lg-table-cell text-nowrap p-3 py-2 text-end text-nowrap"
          >
            Hành động
          </span>
        </div>
        <!-- Item -->
        <div
          v-for="value in listNews.data"
          class="cart-item d-block border w-100 d-lg-table-row border rounded-3 p-3 mb-3 bg-white shadow-sm"
        >
          <div
            class="cart-product mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Ảnh đại diện:</span>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <div class="ratio ratio-1x1" style="width: 80px; height: 80px">
                <img
                  :src="value.thumbnail || '/images/image-error.svg'"
                  alt="thumbnail"
                  class="img-thumbnail"
                />
              </div>
            </div>
          </div>

          <div
            class="cart-product text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
          >
            <span class="d-lg-none text-nowrap me-2 fw-semibold">Tiêu đề:</span>
            <div
              class="d-flex flex-column align-items-end align-items-lg-start justify-content-center"
            >
              <span class="fw-medium">
                {{ textTruncate(value.title, 50) }}</span
              >
              <small class="text-muted">
                <NuxtLink class="" :to="`/news/${value.slug}`">
                  {{ textTruncate(value.slug, 50) }}
                </NuxtLink>
              </small>
            </div>
          </div>

          <!-- Price -->
          <div
            class="cart-price text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Chuyên mục:</span>
            <div class="d-flex flex-column">
              {{
                categoryOptions.find(
                  (option) => option.value === value.category
                )?.label
              }}
            </div>
          </div>

          <div
            class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Ngày tạo:</span>
            <div class="d-flex justify-content-end">
              <span class="text-lg-end">
                {{ formatDate(value.created_at) }}
              </span>
            </div>
          </div>
          <div
            class="cart-action align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Hành động:</span>
            <div class="d-flex justify-content-end gap-2">
              <button
                @click="editNews(value._id)"
                class="btn btn-sm btn-primary"
              >
                Sửa
              </button>
              <button
                @click="deleteNews(value._id)"
                class="btn btn-sm btn-danger"
              >
                Xóa
              </button>
            </div>
          </div>
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
];

const queryList = ref({
  page: 1,
  limit: 5,
  category: "",
  keyword: "",
});

watch(
  () => keyword.value,
  (newVal) => {
    queryList.value.keyword = newVal;
    fetchNewsList();
  }
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

function editNews(id: string) {
  editId.value = id;
  showModal.value = true;
  // Emit event to modal to load news data for editing
  // You may need to implement this in AuthModalActNews component
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
