<template>
  <div
    :class="[
      'btn-group bg-white rounded-2  overflow-hidden border border-dark',
      size === 'sm' ? 'btn-group-sm' : '',
      size === 'lg' ? 'btn-group-lg' : '',
    ]"
    role="group"
    aria-label="Basic outlined example"
  >
    <button @click="decrease" :disabled="localValue <= 0" type="button" class="btn rounded-end-0 rounded-1 d-flex align-items-center btn-outline-dark border-0">
      <Minus :stroke-width="2" :size="size === 'sm' ? 14 : size === 'lg' ? 24 : 18" />
    </button>
    <input
      type="number"
      min="0"
      v-model.number="localValue"
      @input="onInput"
      :class="[
        'form-control input-number border-0 border-start border-end shadow-none text-center rounded-0',
        size === 'sm' ? 'form-control-sm input-number-sm' : '',
        size === 'lg' ? 'form-control-lg input-number-lg' : '',
      ]"
    />
    <button @click="increase" type="button" class="btn rounded-start-0 d-flex rounded-1 align-items-center btn-outline-dark border-0">
      <Plus :stroke-width="2" :size="size === 'sm' ? 14 : size === 'lg' ? 24 : 18" />
    </button>
  </div>
</template>

<script lang="ts" setup>

type SizeType = 'sm' | 'md' | 'lg';
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  size: {
    type: String as PropType<SizeType>,
    default: 'md', // sm, md, lg
  },
});

const { isAuthenticated,togglePopupLogin } = useAuth();
const emit = defineEmits(["update:modelValue", "change"]);

const localValue = ref(props.modelValue);

// Khi prop thay đổi từ cha, cập nhật localValue
watch(() => props.modelValue, (val) => {
  // Keep localValue in sync with parent but ensure it's a number
  const num = Number(val);
  localValue.value = Number.isFinite(num) ? num : 0;
});

watch(localValue, (newVal) => {


});
const onInput = () => {
  // Parse the typed value; if it's not a valid number, don't emit (prevents accidental resets)
  const numeric = Number(localValue.value);
  if (Number.isNaN(numeric)) return;
  emit("update:modelValue", numeric);
  emit("change", numeric);
};

const increase = () => {
  if(!isAuthenticated.value){
    useToast().error("Vui lòng đăng nhập để đặt hàng");
    togglePopupLogin();
    return;
  }
  if(localValue.value < 100){
    localValue.value++;
    emit("update:modelValue", Number(localValue.value));
    emit("change", Number(localValue.value));
  }
};
const decrease = () => {
  if(!isAuthenticated.value){
    useToast().error("Vui lòng đăng nhập để đặt hàng");
    togglePopupLogin();
    return;
  }
  if (localValue.value > 1) {
    localValue.value--;
    emit("update:modelValue", Number(localValue.value));
    emit("change", Number(localValue.value));
  }
};
</script>

<style scoped>
/* Hide number input arrows for Chrome, Safari, Edge, Opera */
.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input arrows for Firefox */
.input-number[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
.input-number {
  width: 45px;
}

.input-number-sm {
  width: 30px;
  font-size: 0.75rem;
  height: 24px;
  padding: 2px 4px;
}
.input-number-lg {
  width: 60px;
  font-size: 1.25rem;
  height: 40px;
  padding: 6px 12px;
}
</style>
