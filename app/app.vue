<template>
  <NuxtLoadingIndicator :height="4" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToastContainer />
  <UiMenuMobile v-if="isMobile" />
</template>

<script setup lang="ts">

  const isMobile = ref(false)

  // Global SEO Meta Tags
  useSeoMeta({
    // Basic Meta Tags
    title: 'Sỉ Dược - Nhà cung cấp dược phẩm uy tín tại Việt Nam',
    description: 'Sỉ Dược - Nhà cung cấp dược phẩm, thực phẩm chức năng chất lượng cao, giá sỉ cạnh tranh. Hàng chính hãng, giao hàng nhanh toàn quốc.',
    keywords: 'dược phẩm, sỉ dược, thuốc, vitamin, thực phẩm chức năng, sỉ hàng',

    // Open Graph Tags (Social Media Share)
    ogTitle: 'Sỉ Dược - Nhà cung cấp dược phẩm uy tín',
    ogDescription: 'Nhà cung cấp dược phẩm, vitamin, thực phẩm chức năng chất lượng cao với giá sỉ cạnh tranh. Hàng chính hãng, giao hàng toàn quốc.',
    ogImage: '/images/final-medial.png',
    ogImageAlt: 'Sỉ Dược - Nhà cung cấp dược phẩm',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogType: 'website',
    ogUrl: 'https://tapmed.vn',

    // Twitter Card Tags
    twitterCard: 'summary_large_image',
    twitterTitle: 'Sỉ Dược - Nhà cung cấp dược phẩm uy tín',
    twitterDescription: 'Dược phẩm, vitamin, thực phẩm chức năng chất lượng cao, giá sỉ cạnh tranh.',
    twitterImage: '/images/final-medial.png',

    // Additional SEO Tags
    robots: 'index, follow',
    canonical: 'https://tapmed.vn',
    author: 'Sỉ Dược',

    // Additional Meta Tags
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
  })

  function checkIsMobile() {
    isMobile.value = window.innerWidth <= 768
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIsMobile)
  })
</script>
