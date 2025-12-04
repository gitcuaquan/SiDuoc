<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div v-if="loading" style="z-index: 999999"
          class="text-center position-absolute bg-blur w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
          <UiLoading />
        </div>
        <template v-if="!isSuccess">
          <div class="modal-body">
            <div class="position-absolute top-0 end-0 m-3">
              <button data-bs-dismiss="modal" class="btn btn-light ms-auto btn-sm rounded-circle px-1 shadow-sm">
                <X :stroke-width="1" />
              </button>
            </div>
            <div class="text-center mb-3">
              <!-- <img src="/images/logo-tapmed.png" style="width: 200px" alt="" /> -->
              <h4 class="modal-title mt-2 text-capitalize" id="modal-loginLabel">
                Đăng ký thành viên
              </h4>
              <p class="text-muted">
                <small>
                  Đăng ký làm thành viên để nhận được nhiều khuyến mãi hấp dẫn và
                  theo dõi đơn hàng của bạn.
                </small>
              </p>
            </div>
            <!-- {{ custumerInfo }} -->
            <form class="row gy-2 gx-3" ref="form" novalidate>
              <div class="col-12 col-md-6">
                <label for="FullName" class="form-label">Họ và tên</label>
                <input type="text" v-model="custumerInfo.FullName" class="form-control" required id="FullName"
                  placeholder="Nhập họ và tên đầy đủ của bạn" />
                <small class="text-danger" v-if="errors.FullName">{{
                  errors.FullName
                }}</small>
              </div>

              <div class="col-12 col-md-6">
                <label for="NameCoSo" class="form-label">Tên cơ sở</label>
                <input type="text" class="form-control" v-model="custumerInfo.NameCoSo" required id="NameCoSo"
                  placeholder="Nhập tên cơ sở đang kinh doanh" />
                <small class="text-danger" v-if="errors.NameCoSo">{{
                  errors.NameCoSo
                }}</small>
              </div>
              <div class="col-12 col-md-6">
                <label for="PhoneNumber" class="form-label">Số điện thoại</label>
                <input type="phone" class="form-control" v-model="custumerInfo.PhoneNumber" required id="PhoneNumber"
                  placeholder="Nhập số điện thoại" />
                <small class="text-danger" v-if="errors.PhoneNumber">
                  {{ errors.PhoneNumber }}
                </small>
              </div>
              <div class="col-12 col-md-6">
                <label for="Password" class="form-label">Mật khẩu</label>
                <div class="position-relative">
                  <input :type="showPassword ? 'text' : 'password'" class="form-control" required
                    v-model="custumerInfo.Password" id="Password" minlength="6" placeholder="Nhập mật khẩu" />
                  <button type="button" @click="showPassword = !showPassword"
                    class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-white">
                    <EyeOff v-if="showPassword" :stroke-width="1" />
                    <Eye v-if="!showPassword" :stroke-width="1" />
                  </button>
                </div>
                <small class="text-danger" v-if="errors.Password">{{
                  errors.Password
                }}</small>
              </div>
              <div class="col-12 col-md-6">
                <label for="city" class="form-label">Thành phố</label>
                <SharedModuleSelect @select="citySelect = $event" :data="City">
                  <template #item="{ item }">
                    {{ (item as any).name }}
                  </template>
                  <template #default="{ selected }">
                    <button class="form-control w-100 d-flex justify-content-between align-items-center" type="button"
                      data-bs-toggle="dropdown">
                      {{ selected?.name || "Chọn thành phố" }} <chevron-down />
                    </button>
                  </template>
                </SharedModuleSelect>
                <input type="text" id="NameProvince" required hidden v-model="custumerInfo.NameProvince" />
                <small class="text-danger" v-if="errors.NameProvince">
                  {{ errors.NameProvince }}
                </small>
              </div>
              <div class="col-12 col-md-6">
                <label for="NameDistrict" class="form-label">Xã phường</label>
                <SharedModuleSelect :data="listCity" @select="custumerInfo.NameDistrict = $event.name">
                  <template #item="{ item }">
                    {{ (item as any).name }}
                  </template>
                  <template #default="{ selected }">
                    <button class="form-control w-100 d-flex justify-content-between align-items-center" type="button"
                      data-bs-toggle="dropdown">
                      {{ selected?.name || "Chọn xã phường" }} <chevron-down />
                    </button>
                  </template>
                </SharedModuleSelect>
                <input type="text" id="NameDistrict" required hidden v-model="custumerInfo.NameDistrict" />
                <!-- <select
              
                v-model="custumerInfo.NameDistrict"
                class="form-control"

              >
                <option value="null" disabled selected>Chọn xã phường</option>
                <option v-for="value in listCity" :value="value.name">
                  {{ value.name }}
                </option>
              </select> -->
                <small class="text-danger" v-if="errors.NameDistrict">{{
                  errors.NameDistrict
                }}</small>
              </div>
              <div class="col-12">
                <label for="Address" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="custumerInfo.Address" id="Address" required
                  placeholder="Nhập địa chỉ" />
                <small class="text-danger" v-if="errors.Address">
                  {{ errors.Address }}</small>
              </div>
            </form>
            <!-- Giấy tờ liên quan -->
            <div class="row justify-content-center mt-2 g-3">
              <div class="col-6 col-md-4">
                <SharedModuleUpload @change="setFileTo($event, 'Certificate1')"
                  placeholder="Tải lên chứng chỉ hành nghề dược" />
              </div>
              <div class="col-6 col-md-4">
                <SharedModuleUpload @change="setFileTo($event, 'Certificate2')"
                  placeholder="Tải lên giấy chứng nhận đăng ký kinh doanh" />
              </div>
              <div class="col-6 col-md-4">
                <SharedModuleUpload @change="setFileTo($event, 'Certificate3')"
                  placeholder="Tải lên giấy chứng nhận đủ điều kiện kinh doanh dược" />
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center border-0">
            <button type="button" @click="submitForm" class="btn btn-primary px-5">
              Đăng ký
            </button>
          </div>
          <p class="text-center mb-3">
            Bạn đã là thành viên?
            <a @click="openLogin" class="text-link" role="button">
              Đăng nhập ngay
            </a>
          </p>
        </template>
        <div class="modal-body" v-else>
          <div class="text-center mb-3">
            <img src="/images/success.svg" style="width: 300px" alt="Success" />
            <h4 class="modal-title mt-2 text-capitalize" id="modal-loginLabel">
              Đăng ký thành công!
            </h4>
            <p class="text-muted">
              <small>
                Cảm ơn bạn đã đăng ký thành viên. Vui lòng chờ xác nhận tài khoản.
              </small>
            </p>
            <button type="button" @click="openLogin" class="btn btn-primary px-5">
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import City from "@/data/province.json";
  import Ward from "@/data/ward.json";
  import { Modal } from "bootstrap";
  import type { ProjectConfig } from "~/model";
  import { Customer } from "~/model";
  const modalInstance = ref<Modal | null>(null);

  const emit = defineEmits(["close"]);
  const { getErrorDetail } = useFormValidation();
  const { togglePopupLogin } = useAuth();
  const { $appServices } = useNuxtApp();

  // ========================== STATE ==========================


  const isSuccess = ref(false);

  const checkValid = ref(false);
  const errors = ref<Record<string, string>>({});
  const form = ref<HTMLElement | null>(null);
  const showPassword = ref(false);
  const citySelect = ref<ProjectConfig.CitySetting | null>(null);
  const wardSelect = ref<ProjectConfig.DistrictSetting | null>(null);

  const custumerInfo = ref<Customer>(new Customer({}));

  const listCity = ref<ProjectConfig.DistrictSetting[]>([]);
  const loading = ref(false);
  // ========================== LIFECYCLE ==========================
  watch(
    () => custumerInfo.value,
    (newCode) => {
      if (checkValid.value) {
        validateForm();
      }
    },
    { deep: true }
  );

  watch(
    () => custumerInfo.value.NameDistrict,
    (newWard) => {
      if (newWard) {
        custumerInfo.value.CodeDistrict = (
          listCity.value.find((item) => item.name == newWard) as any
        )?.code;
      } else {
        custumerInfo.value.NameDistrict = "";
      }
    }
  );

  watch(
    () => citySelect.value,
    (newCity) => {
      if (newCity) {
        custumerInfo.value.NameProvince = newCity.name;
        listCity.value = (Ward as ProjectConfig.DistrictSetting[]).filter(
          (item) => item.parent == newCity.code
        );
        custumerInfo.value.NameDistrict = "";
      } else {
        custumerInfo.value.NameProvince = "";
      }
    }
  );

  onMounted(() => {
    initModal();
  });

  function initModal() {
    const modal = document.getElementById("modal-register");
    modalInstance.value = new Modal(modal!);
    modalInstance.value.show();
    modal!.addEventListener("hidden.bs.modal", () => {
      emit("close");
    });
  }

  function openLogin() {
    togglePopupLogin();
    modalInstance.value?.hide();
  }
  // ========================== FUNCTIONS ==========================

  function setFileTo(file: File | null, key: keyof Customer) {
    // use a type assertion to bypass strict property type mismatch when assigning files
    (custumerInfo.value as any)[key] = file;
  }

  function validateForm() {
    errors.value = {};

    if (!form.value) return;
    if (!(form.value as HTMLFormElement).checkValidity()) {
      const inputs = form.value.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        const el = input as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (!el.checkValidity()) {
          const err = getErrorDetail(el);
          errors.value[el.id] = err.message ?? "Lỗi không xác định";
        } else {
          delete errors.value[el.id];
        }
      });
    }
    if (Object.keys(errors.value).length === 0) {
      return true;
    } else {
      form.value.classList.add("was-validated");
      return false;
    }
  }
  function convertDataToFormData(data: Record<string, any>) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return formData;
  }

  async function submitForm(e: Event) {
    // const formData = new FormData();
    // for (const key in custumerInfo.value) {
    //   formData.append(key, (custumerInfo.value as any)[key]);
    // }
    e.preventDefault();
    checkValid.value = true;
    if (validateForm()) {
      checkValid.value = false;

      // Submit form logic here
      const formData = convertDataToFormData(custumerInfo.value);
      try {
        isSuccess.value = false;
        loading.value = true;
        const response = await $appServices.auth.register(formData);
        if (response && response.isSucceeded) {
          modalInstance.value?.hide();
          useToast().success("Đăng ký thành công! Vui lòng đăng nhập.");
          isSuccess.value = true;
          // togglePopupLogin();
        } else {
          useToast().error(
            response.message || "Đăng ký thất bại! Vui lòng thử lại."
          );
        }
      } catch (error: any) {
        useToast().error(
          error.data.message || "Đăng ký thất bại! Vui lòng thử lại."
        );
      } finally {
        loading.value = false;
      }
    }
  }
</script>

<style></style>
