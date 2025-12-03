<template>
  <HomeModuleHero />
  <section class="my-3">
    <HomeModuleStory />
  </section>
  <section class="my-3">
    <HomeModuleFeature />
  </section>
  <section class="container mt-5 pt-5">
    <h2 class="text-center text-capitalize">Ưu đãi mới nhất</h2>
    <p class="text-muted text-center mb-3">
      <small>
        Cập nhật những ưu đãi và khuyến mãi mới nhất từ TapMed dành cho khách
        hàng.
      </small>
    </p>
    <HomeModulePromotion />
  </section>


  <section class="container my-3">
    <h2 class="text-center">Sản phẩm nổi bật</h2>
    <p class="text-muted text-center mb-3">
      <small>
        Khám phá những sản phẩm nổi bật được chọn lọc kỹ càng từ những nhà cung
        cấp uy tín.
      </small>
    </p>
    <ProductModuleSliderItem />
  </section>
  <section class="container my-5">
    <h2 class="mt-5 text-center text-capitalize">Tin tức nổi bật</h2>
    <p class="text-center text-muted mb-3">
      <small>Cập nhật những tin tức mới nhất và nổi bật nhất từ TapMed.</small>
    </p>
    <NewsList :limit="3" />
  </section>

  <section class="container my-5">
    <h2 class="mt-5 text-center text-capitalize">
      Khách hàng nói về chúng tôi
    </h2>
    <p class="text-center text-muted mb-3">
      <small>Đọc những đánh giá và phản hồi từ khách hàng đã trải nghiệm dịch vụ của
        TapMed.</small>
    </p>
    <HomeModuleTestimonial />
  </section>

  <section class="container my-5">
    <div class="container text-center mb-4">
      <h2 class="text-center">
        Đối tác của <b class="text-primary">TapMed</b>
      </h2>
      <p class="text-muted">
        <small>Chúng tôi hợp tác với các thương hiệu và nhà cung cấp uy tín để mang
          đến cho bạn những sản phẩm tốt nhất.</small>
      </p>
    </div>
    <HomeModuleMarquee :speed="30" class="my-2">
      <img v-for="partner in partners" :key="partner.id" style="width: 200px" :src="partner.src" :alt="partner.alt" />
    </HomeModuleMarquee>
    <!-- <HomeModuleMarquee :speed="50" direction="right" class="my-2">
      <img v-for="partner in partners" :key="`right-${partner.id}`" style="width: 100px" :src="partner.src"
        :alt="partner.alt" />
    </HomeModuleMarquee> -->
  </section>
</template>

<script lang="ts" setup>
  // SEO Meta Tags for Homepage
  useSeoMeta({
    title: 'Sỉ Dược - Nhà cung cấp dược phẩm, vitamin uy tín tại Việt Nam',
    description: 'Sỉ Dược là nhà cung cấp hàng đầu về dược phẩm, vitamin, thực phẩm chức năng. Hàng chính hãng, giá sỉ cạnh tranh, giao hàng toàn quốc.',
    ogTitle: 'Sỉ Dược - Dược phẩm & Vitamin Chính Hãng',
    ogDescription: 'Khám phá sản phẩm dược phẩm, vitamin, thực phẩm chức năng chất lượng từ Sỉ Dược. Giá sỉ ưu đãi, giao hàng nhanh.',
    ogImage: '/images/final-medial.png',
    ogImageAlt: 'Sỉ Dược - Nhà cung cấp dược phẩm',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  })

  // Danh sách đối tác
  const partners = ref([
    {
      id: 1,
      src: "https://tapmed.vn/TapMedVn/images/partner/16.png",
      alt: "Partner 16",
    },
    {
      id: 2,
      src: "https://tapmed.vn/TapMedVn/images/partner/17.png",
      alt: "Partner 17",
    },
    {
      id: 3,
      src: "https://tapmed.vn/TapMedVn/images/partner/18.png",
      alt: "Partner 18",
    },
    {
      id: 4,
      src: "https://tapmed.vn/TapMedVn/images/partner/19.png",
      alt: "Partner 19",
    },
    {
      id: 5,
      src: "https://tapmed.vn/TapMedVn/images/partner/20.png",
      alt: "Partner 20",
    },
    {
      id: 6,
      src: "https://tapmed.vn/TapMedVn/images/partner/21.png",
      alt: "Partner 21",
    },
    {
      id: 7,
      src: "https://tapmed.vn/TapMedVn/images/partner/22.png",
      alt: "Partner 22",
    },
    {
      id: 8,
      src: "https://tapmed.vn/TapMedVn/images/partner/23.png",
      alt: "Partner 23",
    },
    {
      id: 9,
      src: "https://tapmed.vn/TapMedVn/images/partner/25.png",
      alt: "Partner 25",
    },
    {
      id: 10,
      src: "https://tapmed.vn/TapMedVn/images/partner/26.png",
      alt: "Partner 26",
    },
    {
      id: 11,
      src: "https://tapmed.vn/TapMedVn/images/partner/27.png",
      alt: "Partner 27",
    },
    {
      id: 12,
      src: "https://tapmed.vn/TapMedVn/images/partner/28.png",
      alt: "Partner 28",
    },
  ]);
</script>

<style scoped>
  img {
    mix-blend-mode: multiply !important;
    /* Hòa trộn điểm ảnh trắng với nền bên dưới */
  }
</style>
