<!-- <template>
  <div class="main-hero">
    <div class="w-100 h-100 position-absolute bg_custom top-0" style=""></div>
    <HomeModuleTest
      :horizontalBeamOffset="0"
      :horizontal-sizing="1"
      :vertical-sizing="10"
      :wisp-speed="50"
      :verticalBeamOffset="0.05"
      :fog-fall-speed="2"
      :flow-strength="0.5"
      :fog-intensity="1"
      color="#189847"
    />

    <div class="main_content">
      <div class="d-flex flex-column align-items-center gap-3">
        <img src="/images/logo-tapmed.png" class="logo" alt="logo Sỉ Dược" />
        <h1 class="big-title fw-bold text-center text-primary">
          Nhà Phân Phối Thuốc, Dược Hàng Đầu Việt Nam
        </h1>
        <div
          class="d-flex align-items-center justify-content-lg-start justify-content-center"
        >
          <div class="avatar-group me-3">
            <div class="avatar overflow-hidden">
              <img
                src="https://tapmed.vn/TapMedVn/images/av2.jpg"
                class="w-100 object-fit-cover"
                alt=""
              />
            </div>
            <div class="avatar overflow-hidden">
              <img
                src="https://tapmed.vn/TapMedVn/images/av3.jpg"
                class="w-100 object-fit-cover"
                alt=""
              />
            </div>
            <div class="avatar overflow-hidden">
              <img
                src="https://tapmed.vn/TapMedVn/images/av4.jpg"
                class="w-100 object-fit-cover"
                alt=""
              />
            </div>
            <div class="avatar overflow-hidden">
              <img
                src="https://tapmed.vn/TapMedVn/images/av5.jpg"
                class="w-100 object-fit-cover"
                alt=""
              />
            </div>
          </div>
          <div>
            <div class="stat-number text-danger">5000+</div>
            <small class="text-primary">Khách hàng hài lòng</small>
          </div>
        </div>
        <p class="w-75 text-center">
          <small
            >Cung cấp mô hình nhập thuốc dễ dàng giải quyết vấn đề y tế một cách
            nhanh chóng và chất lượng. Cam kết về nguồn gốc sản phẩm và hiệu quả
            chi phí</small
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.main-hero {
  height: 750px;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}
.big-title {
  font-size: 3rem;
}
.logo {
  width: 400px;
  height: auto;
}
.main_content {
  background-image: radial-gradient(
    circle,
    rgb(24, 152, 71, 0.2) 2px,
    transparent 2px
  );
  background-size: 25px 25px;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%);
  width: 86%;
  height: 60%;
  background-color: #ffffff;
  border-radius: 20px;
  border: 2px solid #189847;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 30px rgba(24, 152, 71, 0.6);
  z-index: 6;
}
.bg_custom {
  background-image: radial-gradient(
    circle,
    rgb(24, 152, 71, 0.2) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}
@media screen and (max-width: 768px) {
  .logo {
    width: 150px;
    height: auto;
  }
  .big-title {
    font-size: 1.5rem;
  }
  .main-hero {
    height: 600px;
  }
  .bg_custom {
    background-image: radial-gradient(
      circle,
      rgb(24, 152, 71, 0.1) 2px,
      transparent 2px
    );
  }
  .main_content {
    background-image: radial-gradient(
      circle,
      rgb(24, 152, 71, 0.2) 2px,
      transparent 2px
    );
  }
}

.avatar-group {
  display: flex;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #212529;
  margin-left: -10px;
  border: 2px solid #189847;
}

.stat-number {
  color: #ffdee2;
  /* hồng nhạt nổi bật */
  font-weight: 700;
  font-size: 1.25rem;
}
</style> -->
<template>
  <h1>hi</h1>
</template>
<script setup lang="ts">
const { $appServices } = useNuxtApp();

const url = ref<string>("https://api-tapmed.sse.net.vn/api/fileupload/52e4818c-dc2e-44b0-9919-90c0619f6854/view");

async function fetchFile() {
  try {
    const response = await $appServices.file.getFileBlob(url.value);
    console.log("File blob response:", response);
  } catch (error) {
    console.error("Error fetching file blob:", error);
  }
}
onMounted(() => {
  fetchFile();
});
</script>
