<template>
  <div>
    <div class="container">
      <div class="row border-2 justify-content-center rounded  align-items-center">
        <div class="col-lg-5">
          <img src="/images/story/mission.svg" alt="" />
        </div>
        <div class="col-lg-5">
          <h2 class="text-capitalize mb-4">Tầm nhìn và Sứ mệnh</h2>
          <p class="text-muted" style="text-align: justify;">
            <Quote :size="24" style="transform: scaleX(-1)" class="me-2 text-primary" />
            <b class="text-uppercase text-primary">Tapmed</b> muốn trở thành công ty hàng đầu tại Việt Nam trong lĩnh
            vực y
            tế, tiên phong trong việc cung cấp nguồn thuốc sỉ tới tay khách hàng
            một cách tiện lợi và nhanh chóng, nâng cao chất lượng chăm sóc sức
            khỏe cộng đồng. Với mục tiêu cung cấp dịch vụ y tế chất lượng cao và
            chi phí hợp lý, <b class="text-uppercase text-primary">Tapmed</b> cam kết tạo nên một hệ thống y tế bền
            vững,
            đổi mới và hiệu quả.
          </p>
          <p class="text-muted" style="text-align: justify;">
            Cung cấp mô hình nhập thuốc dễ dàng giải quyết vấn đề y tế một cách
            nhanh chóng và chất lượng. Đối với Quý khách hàng: Sử dụng dịch vụ
            các giải pháp đặt hàng dược phẩm và được giải quyết vấn đề nhanh
            chóng, chất lượng với các cam kết về nguồn gốc sản phẩm và hiệu quả
            chi phí.
            <Quote :size="24" class="ms-2 text-primary" />
          </p>
          <a href="https://zalo.me/2026867773930567367" target="_blank" class="btn btn-primary mt-3">Liên hệ hợp tác</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped>
  .bg-custom {
    background: linear-gradient(-90deg,
        rgba(var(--bs-primary-rgb), 0.1) 0%,
        #ffffff 100%);
  }
</style>
