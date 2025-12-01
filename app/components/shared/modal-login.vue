<template>
  <div class="modal fade" id="modal-login" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div v-if="loading" style="z-index: 999999"
          class="text-center position-absolute bg-blur w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
          <UiLoading />
        </div>
        <div class="modal-body">
          <div class="position-absolute top-0 end-0 m-3">
            <button data-bs-dismiss="modal" class="btn btn-light ms-auto btn-sm rounded-circle px-1 shadow-sm">
              <X :stroke-width="1" />
            </button>
          </div>
          <div class="text-center mb-3">
            <img src="/images/logo-tapmed.png" style="width: 200px" alt="" />
            <h4 class="modal-title mt-2 text-capitalize" id="modal-loginLabel">
              Đăng nhập thành viên
            </h4>
          </div>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="phone" class="form-label">Số điện thoại</label>
              <input type="phone" class="form-control" v-model="data.userName" required id="phone"
                placeholder="Nhập số điện thoại" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <div class="position-relative">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" required v-model="data.password"
                  id="Password" minlength="6" placeholder="Nhập mật khẩu" />
                <button type="button" @click="showPassword = !showPassword"
                  class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-white">
                  <EyeOff v-if="showPassword" :stroke-width="1" />
                  <Eye v-if="!showPassword" :stroke-width="1" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center border-0">
          <button @click="login" class="btn btn-primary w-50">Đăng nhập</button>
        </div>
        <p class="text-center mb-3">
          Bạn chưa có tài khoản?
          <a role="button" @click="openRegister" class="text-link">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();

  import { Modal } from "bootstrap";
  import type { BaseResponseOne } from "~/model/http/BaseResponse";

  const { $appServices } = useNuxtApp();
  const modalInstance = ref<Modal | null>(null);

  type LoginResponse = {
    expiration: string;
    token: string;
    refreshToken: string;
  };

  const { setToken, setUser, togglePopupRegister } = useAuth();
  const { initCartFromStorage } = useCart();
  const emit = defineEmits(["close"]);

  const loading = ref(false);

  const data = reactive({
    userName: "",
    password: "",
  });
  const showPassword = ref(false);
  onMounted(() => {
    initModal();
  });
  watch(
    () => route.fullPath,
    (newVal) => {
      if (newVal.includes("auth")) {
        modalInstance.value?.hide();
      }
    }
  );
  function initModal() {
    const modal = document.getElementById("modal-login");
    modalInstance.value = new Modal(modal!);
    modalInstance.value.show();
    modal!.addEventListener("hidden.bs.modal", () => {
      emit("close");
    });
  }

  function openRegister() {
    togglePopupRegister();
    modalInstance.value?.hide();
  }

  async function login() {
    loading.value = true;
    try {
      const response = await $appServices.auth.login<
        BaseResponseOne<LoginResponse>
      >({
        userName: data.userName,
        password: data.password,
      });

      // Set token trước tiên
      setToken(response.data?.token!);

      // Đợi một chút để đảm bảo cookie được cập nhật
      await new Promise((resolve) => setTimeout(resolve, 100));

      const user = await $appServices.customer.detail();
      setUser(user.data);
      initCartFromStorage();
      useToast().success("Đăng nhập thành công");
      useRouter().push("/auth");
      modalInstance.value?.hide();
    } catch (error: any) {
      useToast().error(error.data.message || "Đăng nhập thất bại");
      // Handle login failure (e.g., show error message)
    } finally {
      loading.value = false;
    }
  }
</script>

<style></style>
