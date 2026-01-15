<template>
  <div id="main-image" class="position-relative">
    <div class="d-flex w-100 justify-content-center align-items-center">
      <div class="ratio rounded overflow-hidden ratio-1x1" style="width: 60%; height: 60%;">
        <img :src="selectedImage?.url || '/images/image-error.svg'" alt="main image " />
      </div>
    </div>
    <!-- <div class="position-absolute top-50 start-0 ms-3">
      <CircleChevronLeft @click="prevImage" role="button" :size="36" />
    </div>
    <div class="position-absolute top-50 end-0 me-3">
      <CircleChevronRight @click="nextImage" role="button" :size="36" />
    </div> -->
  </div>
  <div id="thumbnail-container" v-if="(props.images?.length || 0) > 1"
    class="d-flex gap-2 mt-3 flex-nowrap overflow-auto w-100 justify-content-start">
    <div v-for="(img) in props.images" :key="img.url" class="thumbnail rounded overflow-hidden"
      :class="{ active: img.url === selectedImage?.url }" @click="selectedImage = img">
      <img :src="img.url || '/images/image-error.svg'" alt="thumbnail" class="object-fit-lg-contain" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface ImageUrl {
    originalName: string;
    url: string;
  }

  const props = defineProps<{
    images?: ImageUrl[];
  }>();

  const selectedImage = ref<ImageUrl | undefined>(props.images?.[0]);

  onMounted(() => {
    initMouse();
  });

  // Ensure selectedImage initializes when images prop arrives/changes
  watch(() => props.images, (images) => {
    if (images && images.length && !selectedImage.value) {
      selectedImage.value = images[0];
    }
  });

  watch(selectedImage, (newImage) => {
    const scrollContainer = document.getElementById("thumbnail-container");
    if (!scrollContainer) return;
    const thumbnails = scrollContainer.querySelectorAll(".thumbnail");
    const newIndex = props.images ? props.images.findIndex(i => i.url === newImage?.url) : -1;
    const target = newIndex >= 0 ? (thumbnails[newIndex] as HTMLElement | undefined) : undefined;
    if (target) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (
        targetRect.left < containerRect.left ||
        targetRect.right > containerRect.right
      ) {
        target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  });

  function initMouse() {
    const scrollContainer = document.getElementById("thumbnail-container");
    if (!scrollContainer) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Ngăn kéo ảnh mặc định
    scrollContainer.querySelectorAll("img").forEach((img) => {
      img.setAttribute("draggable", "false");
    });

    // set initial cursor
    scrollContainer.style.cursor = "grab";

    const startDrag = (x: number) => {
      isDragging = true;
      startX = x - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      scrollContainer.style.cursor = "grabbing";
      scrollContainer.style.userSelect = "none"; // tránh bị bôi đen text
    };

    const doDrag = (x: number) => {
      if (!isDragging) return;
      const deltaX = x - scrollContainer.offsetLeft;
      scrollContainer.scrollLeft = scrollLeft - (deltaX - startX);
    };

    const endDrag = () => {
      isDragging = false;
      scrollContainer.style.cursor = "grab";
      scrollContainer.style.removeProperty("user-select");
    };

    // 🖱 Desktop
    scrollContainer.addEventListener("mousedown", (e) => startDrag(e.pageX));
    window.addEventListener("mousemove", (e) => doDrag(e.pageX));
    window.addEventListener("mouseup", endDrag);

    // 📱 Mobile
    scrollContainer.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].pageX);
      }
    });
    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        doDrag(e.touches[0].pageX);
      }
    });
    window.addEventListener("touchend", endDrag);
  }

  const prevImage = () => {
    if (!props.images || !props.images.length) return;
    const currentIndex = props.images.findIndex(i => i.url === selectedImage.value?.url);
    const newIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + props.images.length) % props.images.length;
    selectedImage.value = props.images[newIndex];
  };

  const nextImage = () => {
    if (!props.images || !props.images.length) return;
    const currentIndex = props.images.findIndex(i => i.url === selectedImage.value?.url);
    const newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % props.images.length;
    selectedImage.value = props.images[newIndex];
  };
</script>

<style scoped>
  .thumbnail {
    width: 100px;
    height: 100px;
    cursor: pointer;
    flex: none;
    transform: scale(0.95);
    transition: all 0.3s;
    outline: 1px solid transparent;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .thumbnail.active {
    transform: scale(1);
    z-index: 1;
    outline: 1px solid var(--bs-primary);
    outline-offset: 1px;
  }

  #thumbnail-container {
    padding: 0.5rem 0.25rem;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
  }

  #thumbnail-container::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }
</style>
