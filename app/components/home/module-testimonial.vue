<script setup lang="ts">
const containerRef = ref(null);
const slides = ref(Array.from({ length: 10 }));
const swiper = useSwiper(containerRef, {
  effect: "coverflow",
  loop: true,
  grabCursor: true,
  centeredSlides: true,
  autoplay: {
    delay: 2000,
  },
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
  },
});
const feedbacks = [
  {
    avatar: "/images/avatar/av2.jpg",
    name: "Chị Lan",
    city: "TP. Hồ Chí Minh",
    desc: "Tôi rất hài lòng với dịch vụ của Tapmed. Thuốc được giao nhanh chóng và đúng hẹn, chất lượng đảm bảo. Đặc biệt, nhân viên tư vấn rất nhiệt tình và chu đáo. Tôi chắc chắn sẽ tiếp tục hợp tác lâu dài với Tapmed.",
  },
  {
    avatar: "/images/avatar/av1.jpg",
    name: "Anh Hùng ",
    city: "Hà Nội",
    desc: "Tapmed luôn cung cấp các sản phẩm thuốc sỉ với giá cả hợp lý và chất lượng đáng tin cậy. Quy trình đặt hàng và giao nhận rất chuyên nghiệp, giúp tôi yên tâm hơn trong công việc kinh doanh của mình.",
  },
  {
    avatar: "/images/avatar/av4.jpg",
    name: "Chị Hoa",
    city: "Đà Nẵng",
    desc: "Tapmed không chỉ cung cấp thuốc chất lượng mà còn có dịch vụ chăm sóc khách hàng tuyệt vời và hỗ trợ kịp thời khi có bất kỳ vấn đề nào phát sinh. Cảm ơn Tapmed đã đồng hành cùng chúng tôi!",
  },
  {
    avatar: "/images/avatar/av5.jpg",
    name: "Anh Minh",
    city: "Cần Thơ",
    desc: "Là đối tác lâu năm của Tapmed, tôi rất tin tưởng vào chất lượng sản phẩm và dịch vụ. Đội ngũ nhân viên luôn hỗ trợ tận tình, giải đáp mọi thắc mắc nhanh chóng. Đây là đơn vị phân phối thuốc đáng tin cậy nhất mà tôi từng hợp tác.",
  },
  {
    avatar: "/images/avatar/av6.jpg",
    name: "Chị Mai",
    city: "Hải Phòng",
    desc: "Tapmed giúp tôi có nguồn hàng ổn định và đáng tin cậy. Quy trình đặt hàng đơn giản, giao hàng đúng hẹn và sản phẩm đạt tiêu chuẩn. Tôi rất hài lòng và sẽ tiếp tục hợp tác lâu dài.",
  },
];
</script>

<template>
  <ClientOnly>
    <swiper-container
      :coverflowEffect="{
        rotate: 50,
        stretch: 1,
        depth: 120,
        modifier: 1,
      }"
      ref="containerRef"
      style="z-index: 0 !important; padding-top: 50px; padding-bottom: 50px"
      :init="false"
    >
      <swiper-slide v-for="(slide, idx) in feedbacks" :key="idx" class="my-3">
        <div
          class="card border-2 rounded overflow-hidden border-primary border-opacity-25 shadow-sm"
        >
          <div class="card-body" style="background: #ffffff !important">
            <div class="d-flex mb-2 gap-6 justify-content-end">
              <Star
                v-for="value in 5"
                :size="16"
                fill="#ffc107"
                style="color: #ffc107"
              />
            </div>
            <p class="card-text">
              <Quote :size="24" style="transform: scaleX(-1)" class="me-2" />
              <small>{{ slide.desc }}</small>
              <Quote :size="24" class="ms-2" />
            </p>
          </div>
          <div class="card-footer py-2 bg-primary border-0">
            <div class="d-flex gap-2 align-items-center">
              <img class="avatar-custom" :src="slide.avatar" alt="" />
              <div class="text-white">
                <h5 class="card-title mb-0 fw-bold">{{ slide.name }}</h5>
                <small class="text-white">- {{ slide.city }}</small>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style scoped>
.card-body {
  min-height: 120px;
  background: #fff !important;
}

small {
  font-size: 0.8rem;
}

.avatar-custom {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
</style>
