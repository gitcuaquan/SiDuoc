<template>
  <div class="account-sidebar bg-white rounded-3 shadow-sm p-2 p-lg-3">
    <div class="d-flex gap-2 align-items-center">
      <div>
        <h5 class="mb-1">Tài khoản của bạn</h5>
        <ClientOnly>
          <div class="text-muted small">
            Tạ Quân, SĐT: {{ user?.data?.dien_thoai }}
          </div>
        </ClientOnly>
      </div>
      <button class="btn d-lg-none ms-auto btn-sm" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseMenuAuth">
        <Menu />
      </button>
    </div>
    <ul class="list-unstyled mb-0 mt-3 collapse d-lg-block" id="collapseMenuAuth">
      <ClientOnly>
        <template v-for="(item, idx) in menuWithManager" :key="idx">
          <li :class="[
            'account-item mb-1 d-flex align-items-center position-relative p-2 rounded',
            route.path === item.to ? 'active' : '',
          ]">
            <nuxt-link :to="item.to" @click="selectLabel(item.label)"
              class="text-decoration-none stretched-link text-dark d-flex align-items-center w-100">
              <component :is="item.icon" class="me-2 text-primary" :size="20" />
              <span>{{ item.label }}</span>
            </nuxt-link>
          </li>
        </template>
      </ClientOnly>
      <li class="account-item mb-1 d-flex align-items-center position-relative p-2 rounded">
        <div @click="logoutUser()"
          class="text-decoration-none stretched-link text-dark d-flex align-items-center w-100 cursor-pointer">
          <LogOut class="me-2 text-primary" :size="20" />
          <span>Đăng xuất</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  LogOut,
  MessageCircle,
  Newspaper,
  PackageSearch,
  Truck,
  User,
} from "lucide-vue-next";
const { user } = useAuth();
const emitted = defineEmits<{
  (e: "select-label", label: string): void;
}>();
const isManager = computed(() => user.value?.data.is_admin);

const sidebarItems = [
  { icon: User, label: "Hồ sơ của tôi", to: "/auth/info" },
  { icon: Truck, label: "Theo dõi đơn hàng", to: "/auth" },
  // { icon: PackageSearch, label: "Sản phẩm yêu thích", to: "/auth/product-top" },
  {
    icon: Newspaper,
    label: "Quản lý bài viết",
    to: "/auth/news",
    is_manager: true,
  },
  {
    icon: Newspaper,
    label: "Quản lý sản phẩm",
    to: "/auth/product-suggest",
    is_manager: true,
  },
  { icon: MessageCircle, label: "Hỗ trợ khách hàng", to: "/auth/ticket" },
];
const route = useRoute();
watch(
  () => route.fullPath,
  (newVal) => {
    if (
      ["/auth/product-suggest", "/auth/news"].includes(newVal) &&
      !isManager.value
    ) {
      useRouter().push("/auth");
    }
  }
);

const menuWithManager = computed(() => {
  if (!isManager.value) {
    return sidebarItems.filter((item) => !item.is_manager);
  }
  return sidebarItems;
});
function logoutUser() {
  useAuth().clearToken();
  useAuth().clearUser();
  useOrder().resetOrder();
  useRouter().push("/");
}
function selectLabel(label: string) {
  emitted("select-label", label);
}
</script>

<style scoped>
.account-item {
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background-color 0.3s, border-left 0.3s;
}

.active {
  background-color: #f8f9fa;
  font-weight: 500;
  border-left: 4px solid rgba(var(--bs-primary-rgb), 0.5);
}
</style>
