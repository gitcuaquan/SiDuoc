<template>
  <section class="hero mb-5 mb-lg-0">
    <div class="container overflow-hidden">
      <div class="row align-items-center pt-3 pt-lg-0">
        <!-- Left content -->
        <div class="col-lg-6 mb-5 position-relative mb-lg-0 text-lg-start text-center">
          <!-- <h6 class="text-primary fw-bold mb-lg-5">Công Ty TapMed</h6> -->
          <h1 class="hero-title text-capitalize text-primary">
            Nhà Phân Phối Thuốc, Dược <br />
            Hàng Đầu Việt Nam
          </h1>
          <p class="hero-subtitle text-dark">
            Cung cấp mô hình nhập thuốc dễ dàng giải quyết vấn đề y tế một cách
            nhanh chóng và chất lượng. Cam kết về nguồn gốc sản phẩm và hiệu quả
            chi phí
          </p>
          <div class="d-flex align-items-center justify-content-lg-start justify-content-center">
            <div class="avatar-group me-3">
              <div class="avatar overflow-hidden">
                <img src="https://tapmed.vn/TapMedVn/images/av2.jpg" class="w-100 object-fit-cover" alt="" />
              </div>
              <div class="avatar overflow-hidden">
                <img src="https://tapmed.vn/TapMedVn/images/av3.jpg" class="w-100 object-fit-cover" alt="" />
              </div>
              <div class="avatar overflow-hidden">
                <img src="https://tapmed.vn/TapMedVn/images/av4.jpg" class="w-100 object-fit-cover" alt="" />
              </div>
              <!-- <div class="avatar overflow-hidden">
                  <img src="https://tapmed.vn/TapMedVn/images/av5.jpg" class="w-100 object-fit-cover" alt="" />
                </div> -->
            </div>
            <div>
              <div class="stat-number text-danger">5000+</div>
              <small class="text-primary">Khách hàng hài lòng</small>
            </div>
          </div>
        </div>
        <!-- Right image -->
        <div class="col-lg-6">
          <!-- <div class="hero-img mx-auto mx-lg-0"></div> -->
          <SharedTest />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { BodyFilter, FilterItem, OperatorType, type ITemsTapmed } from '~/model';

  const { $appServices } = useNuxtApp();
  const listProduct = ref<ITemsTapmed[]>([]);
  const filterListProduct = ref(
    new BodyFilter<ITemsTapmed>({
      pageIndex: 1,
      pageSize: 10,
      filters: [
        new FilterItem<ITemsTapmed>({
          filterValue: "ten_vt",
          operatorType: OperatorType.Contains,
          valueSearch: "",
        }),
        new FilterItem<ITemsTapmed>({
          filterValue: "ten_nhasanxuat",
          operatorType: OperatorType.Contains,
          valueSearch: "",
        }),
      ],
    })
  );
  async function getProducts() {
    try {
      const products = await $appServices.items.getItems(filterListProduct.value);
      listProduct.value = products.getData;
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  }
  // Không cần logic phức tạp, chỉ static UI
  onBeforeMount(() => {
    getProducts();
  });
</script>

<style scoped>
  .hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg,
        rgba(var(--bs-primary-rgb), 0.6) 0%,
        #ffffff 100%);
    /* background-image: url('/images/hero-bg.jpg'); */
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    text-shadow: 1px 2px 4px #ffffff;
  }

  .hero-subtitle {
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.8);
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

  .hero-img {
    background-image: url("/images/hero-image.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
    min-height: 500px;
    position: relative;
  }

  @media screen and (max-width: 768px) {
    .hero-img {
      min-height: 300px;
      width: 100%;
    }

    .hero-title {
      font-size: 1.75rem;
    }
  }

  .bg-ovelay {
    z-index: -1;
    opacity: 0.3;
  }
</style>
