<template>
  <LayoutAuth :name="'Thông tin cá nhân'" :loading="loading" :breadcrumb="breadcrumb">
    <form class="row gy-1 gx-3">
      <div class="col-12 col-md-6">
        <label for="name" class="form-label">
          <small>Họ và tên</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.ten_kh" id="name"
          placeholder="Nhập họ và tên đầy đủ của bạn" />
      </div>
      <div class="col-md-6 col-12">
        <label for="cccd" class="form-label">
          <small>Số căn cước công dân</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.cccd" id="cccd"
          placeholder="Nhập số căn cước công dân" />
      </div>
      <div class="col-12 col-md-6">
        <label for="businessName" class="form-label">
          <small>Tên cơ sở</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.co_so" id="businessName"
          placeholder="Nhập tên cơ sở đang kinh doanh" />
      </div>

      <div class="col-12 col-md-6">
        <label for="phone" class="form-label">
          <small>Số điện thoại</small>
        </label>
        <input type="phone" class="form-control" required :value="detailUser?.data?.dien_thoai" readonly id="phone"
          placeholder="Nhập số điện thoại" />
      </div>
      <div class="col-12 col-md-6">
        <label for="ten_thanh_pho" class="form-label">
          <small>Thành phố</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.ten_thanh_pho"
          id="ten_thanh_pho" placeholder="Nhập địa chỉ" />
      </div>
      <div class="col-12 col-md-6">
        <label for="ten_xa_phuong" class="form-label">
          <small>Xã phường</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.ten_xa_phuong"
          id="ten_xa_phuong" placeholder="Nhập địa chỉ" />
      </div>
      <div class="col-12">
        <label for="address" class="form-label">
          <small>Địa chỉ</small>
        </label>
        <input type="text" class="form-control" required readonly :value="detailUser?.data?.dia_chi" id="address"
          placeholder="Nhập địa chỉ" />
      </div>
    </form>
    <!-- Giấy tờ liên quan -->
    <div class="row justify-content-center mt-2 g-3">
      <div class="col-6 col-md-4">
        <label for="file1" class="form-label">
          <small>Chứng chỉ hành nghề dược</small>
        </label>
        <div class="ratio ratio-1x1 img-thumbnail overflow-hidden">
          <img :src="detailUser?.data?.url_giay_to1 || '/images/image-error.svg'" alt="" />
        </div>
      </div>
      <div class="col-6 col-md-4">
        <label for="file2" class="form-label">
          <small>Chứng nhận đăng ký kinh doanh</small>
        </label>
        <div class="ratio ratio-1x1 img-thumbnail overflow-hidden">
          <img :src="detailUser?.data?.url_giay_to2 || '/images/image-error.svg'" alt="" />
        </div>
      </div>
      <div class="col-6 col-md-4">
        <label for="file3" class="form-label">
          <small>Chứng nhận đủ điều kiện kinh doanh dược</small>
        </label>
        <div class="ratio ratio-1x1 img-thumbnail overflow-hidden">
          <img :src="detailUser?.data?.url_giay_to3 || '/images/image-error.svg'" alt="" />
        </div>
      </div>
    </div>
    <h6 class="my-3 fw-bold pb-2 d-inline-block text-capitalize">
      Nhóm Thuốc Được phép Kinh Doanh
    </h6>
    <div class="row gy-2 gx-3">
      <div v-for="(item, colIndex) in medicineGroups" :key="colIndex" class="col-12 col-md-4">
        <div class="d-flex gap-2">
          <SquareCheck v-if="item?.checked" class="flex-shrink-0 text-white bg-primary" />
          <Square class="flex-shrink-0 text-muted" v-else />
          <small class="form-check-label" :for="item?.id">
            {{ item?.label }}
          </small>
        </div>
      </div>
    </div>
  </LayoutAuth>
</template>

<script lang="ts" setup>
  import type { ProjectConfig } from "~/model";
  import type {
    CustomerDetail,
    CustomerResponse,
  } from "~/model/customer/Customer";
  definePageMeta({
    middleware: "auth",
  });

  const { $appServices } = useNuxtApp();

  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Tài khoản", to: "/auth" },
    { label: "Hồ sơ khách hàng" },
  ]);
  const loading = ref(false);
  const detailUser = ref<CustomerResponse | null>(null);

  // Danh sách nhóm thuốc kinh doanh được tổ chức thành 3 cột
  const medicineGroups = ref([
    {
      id: "01",
      label: "Thuốc dạng phối hợp có chứa dược chất gây nghiện",
      checked: false,
    },
    {
      id: "02",
      label: "Thuốc phóng xạ và đồng vị phóng xạ",
      checked: false,
    },
    { id: "03", label: "Thuốc bảo quản lạnh (2-8 độ)", checked: false },
    { id: "04", label: "Thuốc thường kê đơn", checked: false },
    {
      id: "05",
      label: "Thuốc dạng phối hợp có chứa dược chất hướng thần",
      checked: false,
    },
    {
      id: "06",
      label: "Thuốc cấm sử dụng trong một số ngành, lĩnh vực",
      checked: false,
    },
    { id: "07", label: "Vaxcin", checked: false },
    { id: "08", label: "Thuốc thiết yếu kê đơn", checked: false },
    {
      id: "09",
      label: "Thuốc dạng phối hợp có chứa tiền chất",
      checked: false,
    },
    { id: "10", label: "Thuốc Độc", checked: false },
    { id: "11", label: "Sinh phẩm (trừ men vi sinh)", checked: false },
    { id: "12", label: "Thuốc không kê đơn", checked: false },
  ]);

  async function getDetailUser() {
    loading.value = true;
    try {
      const response = await $appServices.customer.detail();
      detailUser.value = response.data as CustomerResponse;
      const nhom_thuoc_kinh_doanh = response.data.nhoms || [];
      medicineGroups.value.forEach((group) => {
        if (group) {
          group.checked = nhom_thuoc_kinh_doanh
            .map((item: any) => item.ma_nh)
            .includes(group.id);
        }
      });
    } catch (error) {
      console.log("🚀 ~ error=>", error);
    } finally {
      loading.value = false;
    }
  }
  onMounted(() => {
    getDetailUser();
  });
</script>

<style scoped>
  .sticky-top {
    top: 80px;
    z-index: 0 !important;
  }
</style>
