<template>
  <div class="position-relative">
    <table
      v-if="list?.length"
      class="table align-middle mb-0 table-sm table-borderless"
    >
      <tbody>
        <tr
          v-for="product in listProduct"
          class="border-bottom"
          :key="product.ma_vt"
        >
          <td style="width: 100px">
            <div
              class="ratio z-low overflow-hidden bg-light rounded ratio-1x1"
              style="width: 100px"
            >
              <img
                :src="product.image_urls?.[0]?.url || '/images/image-error.svg'"
                alt=""
              />
            </div>
          </td>
          <td>
            <NuxtLink
              :to="`/product/${product.ma_vt}`"
              class="text-decoration-none link-dark link-product"
            >
              {{ product.ten_vt }}
            </NuxtLink>

            <div class="d-flex flex-wrap mt-1 gap-2">
              <small>
                Giá:
                <strong class="text-danger text-opacity-75 fw-normal">
                  {{ formatCurrency(product.gia_nt2) || "Liên hệ" }}
                </strong>
                /
                <strong class="text-danger text-opacity-75 fw-normal">
                  {{ product.dvt }}
                </strong>
              </small>

              <div class="vr d-none d-md-block"></div>
              <small v-if="product.han_sd_web">
                HSD :
                <strong class="text-danger text-opacity-75 fw-normal">
                  {{
                    product.han_sd_web
                      ? formatDate(product.han_sd_web)
                      : "Đang cập nhật"
                  }}
                </strong>
              </small>
              <template v-if="product.trang_thai_hang_hoa == 2">
                <div class="vr d-none d-md-block"></div>
                <small>
                  <strong class="text-danger text-opacity-75 fw-normal">
                    Hết hàng
                  </strong>
                </small>
              </template>
            </div>
            <div class="d-lg-none mt-2">
              <UiBtnGroup
                size="sm"
                v-model="product.quantity"
                @change="($event) => changeQuantity(product, $event)"
              />
            </div>
          </td>
          <td style="width: 10px" class="d-none d-md-table-cell">
            <UiBtnGroup
              size="sm"
              v-model="product.quantity"
              @change="($event) => changeQuantity(product, $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center bd-blur py-5">
      <div class="text-muted">Không có dữ liệu phù hợp</div>
    </div>
    <div
      class="d-flex position-absolute bd-blur top-0 start-0 w-100 h-100 bg-white bg-opacity-75 justify-content-center align-items-center"
      v-if="props.loading"
    >
      <UiLoading />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ITemsTapmed } from "~/model";

const { addToCart, getQtyById, cart } = useCart();
const { isAuthenticated, togglePopupLogin } = useAuth();

const props = defineProps<{
  list?: ITemsTapmed[];
  loading?: boolean;
}>();

const listProduct = ref<ITemsTapmed[]>(props.list || []);

watch(
  () => props.list,
  (newList) => {
    listProduct.value =
      newList?.map((item) => ({
        ...item,
        quantity: getQtyById(item.ma_vt),
      })) || [];
  }
);
watch(
  () => cart.value,
  () => {
    listProduct.value = listProduct.value.map((item) => ({
      ...item,
      quantity: getQtyById(item.ma_vt),
    }));
  },
  { deep: true }
);

function changeQuantity(item: ITemsTapmed, quantity: number) {
  if (isAuthenticated.value) {
    item.quantity = quantity;
    addToCart(item);
  } else {
    useToast().error("Vui lòng đăng nhập để sử dụng chức năng này");
    togglePopupLogin();
  }
}
</script>

<style scoped>
.bd-blur {
  backdrop-filter: blur(4px);
  min-height: 500px;
}
.ratio img {
  object-fit: contain;
}
small {
  font-size: 0.75rem;
}
.link-product {
  font-size: 0.875rem;
  font-weight: 500;
}
.link-product:hover {
  color: var(--bs-primary) !important;
  text-decoration: underline !important;
}
.z-low {
  z-index: 0 !important;
}
</style>
