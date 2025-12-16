<template>
  <div :class="['rounded-3 p-3 shared-module-upload', `ratio ratio-${props.ratio || '1x1'}`]">
      <div class="d-flex align-items-center justify-content-center w-100">
        <label v-if="!data.file" :for="id"
          class="d-flex stretched-link flex-column align-items-center justify-content-center text-center mb-0">
          <FileUp :stroke-width="1" :size="48" />
          <small class="text-muted mt-3 w-75">
            {{ placeholder || " Click để tải lên" }}
          </small>
        </label>
        <div v-else class="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
          <div v-if="isPdf" class="d-flex flex-column align-items-center justify-content-center">
            <FileUser :stroke-width="1" :size="48" />
            <small class="text-muted mt-2 w-75 text-truncate">{{ data.file.name }}</small>
          </div>
          <div v-else>
            <img :src="data.urlTemp" class="img-fluid rounded-3" />
          </div>
          <button type="button" class="btn btn-link link-danger p-0 position-absolute top-0 end-0" @click="removeFile">
            <X :stroke-width="1" />
          </button>
        </div>
      </div>
    <input :id="id" ref="fileInput" type="file" accept=".png,.jpg,.jpeg,.pdf" @input="handleFileInput"
      class="form-control d-none" />
  </div>
</template>

<script lang="ts" setup>
  const id = useId();

  const props = defineProps<{
    placeholder?: string;
    imageUrl?: string;
    ratio?: '1x1' | '4x3' | '16x9';
  }>();

  const emit = defineEmits<{
    (e: "change", file: File | null): void;
  }>();

  const data = reactive({
    file: null as File | null,
    urlTemp: props.imageUrl || "",
  });
  const isPdf = computed(() => {
    if (!data.file) return false;
    return data.file.type === "application/pdf" || /\.pdf$/i.test(data.file.name);
  });
  watch(
    () => props.imageUrl,
    (newVal) => {
      data.urlTemp = newVal || "";
    }
  );

  const fileInput = ref<HTMLInputElement | null>(null);

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files[0]) {
      // Handle the selected files
      data.file = files[0];
      // revoke previous blob URL if any
      try {
        if (data.urlTemp && data.urlTemp.startsWith && data.urlTemp.startsWith("blob:")) {
          URL.revokeObjectURL(data.urlTemp);
        }
      } catch (e) {}
      // only create an object URL for non-pdf preview (images)
      if (!/^application\/pdf$/i.test(data.file.type) && /\.(png|jpe?g|gif|webp)$/i.test(data.file.name)) {
        data.urlTemp = URL.createObjectURL(data.file);
      } else {
        data.urlTemp = "";
      }
      emit("change", data.file);
    }
  }

  function removeFile() {
    // revoke blob URL if present
    try {
      if (data.urlTemp && data.urlTemp.startsWith && data.urlTemp.startsWith("blob:")) {
        URL.revokeObjectURL(data.urlTemp);
      }
    } catch (e) {}
    data.file = null;
    data.urlTemp = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    emit("change", null);
  }
</script>

<style scoped>
  .shared-module-upload {
    position: relative;
    overflow: hidden;
    border: 1px dashed #ced4da;
  }

  .shared-module-upload input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
</style>
