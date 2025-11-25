<template>
  <QuillEditor
    :options="options"
    toolbar="full"
    contentType="html"
    v-model:content="editorData"
    :modules="modules"
  />
</template>

<script lang="ts" setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import BlotFormatter from "quill-blot-formatter";
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();


const editorData = ref<string>(props.modelValue ?? "");
const options = {
  theme: "snow",
  placeholder: "Viết nội dung tại đây...",
};
const modules = [
  {
    name: "blotFormatter",
    module: BlotFormatter,
    options: {
      /* options */
    },
  },
];

watch(
  () => editorData.value,
  (newVal) => {
    emits("update:modelValue", newVal);
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== editorData.value) {
      editorData.value = newVal ?? "";
    }
  }
);
</script>
<style>
.ql-editor {
  height: 300px;
  max-height: 300px;
  overflow: auto;
}
</style>
