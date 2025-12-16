<template>
  <div class="table-responsive">
    <table class="table table-sm align-middle">
      <thead>
        <tr class="">
          <th scope="col" class="text-nowrap">
            <small>Sản Phẩm</small>
          </th>
          <th scope="col" class="text-nowrap"><small>Đơn giá</small></th>
          <th scope="col" class="text-nowrap"><small>Số lượng</small></th>
          <th scope="col" class="text-nowrap"><small>Thành tiền</small></th>
          <th scope="col" class="text-nowrap"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in cart" :key="item.ma_vt">
          <tr class="card-product">
            <td class="border-0">
              <div class="d-flex align-items-start gap-3">
                <img
                  :src="item.image_urls?.[0]?.url || '/images/image-error.svg'"
                  width="50"
                  height="50"
                  class="rounded border"
                  alt="Sản phẩm"
                />
                <div>
                  <div class="fw-normal">
                    <small
                      style="
                        max-width: 350px;
                        display: inline-block;
                        white-space: normal;
                        word-break: break-word;
                      "
                    >
                      {{ item.ten_vt }}
                    </small>
                  </div>
                  <!-- {{ findDiscountByMaVT(item.ma_vt) }} -->
                </div>
              </div>
            </td>
            <td class="border-0" data-label="Đơn giá">
              <div class="d-flex flex-column gap-1">
                <small
                  :class="{
                    'text-decoration-line-through fw-normal text-muted':
                      findItemInPrevOrder(item.ma_vt) &&
                      (findItemInPrevOrder(item.ma_vt)?.gia_nt2 ?? 0) <
                        item.gia_nt2,
                  }"
                  >{{ formatCurrency(item.gia_nt2) }}
                </small>
                <small
                  class="fw-bold"
                  v-if="
                    findItemInPrevOrder(item.ma_vt) &&
                    (findItemInPrevOrder(item.ma_vt)?.gia_nt2 ?? 0) <
                      item.gia_nt2
                  "
                >
                  {{
                    formatCurrency(
                      findItemInPrevOrder(item.ma_vt)?.gia_nt2 || 0
                    )
                  }}
                </small>
              </div>
            </td>
            <td class="border-0 text-center" data-label="Số lượng">
              <UiBtnGroup size="sm" v-model="item.quantity" v-if="!isShow" />
              <small v-else class="text-center fw-bold">{{
                item.quantity
              }}</small>
            </td>
            <td class="border-0" data-label="Thành tiền">
              <div class="d-flex flex-column gap-1">
                <small
                  :class="{
                    'text-decoration-line-through fw-normal text-muted':findItemInPrevOrder(item.ma_vt) && (findItemInPrevOrder(item.ma_vt)?.gia_nt2 ?? 0) <
                      item.gia_nt2,
                  }"
                  >{{ formatCurrency(item.gia_nt2 * (item.quantity ?? 1)) }}
                </small>
                <small
                  class="fw-bold"
                  v-if="
                   findItemInPrevOrder(item.ma_vt) && (findItemInPrevOrder(item.ma_vt)?.gia_nt2 ?? 0) <
                      item.gia_nt2
                  "
                >
                  {{
                    formatCurrency(
                      (findItemInPrevOrder(item.ma_vt)?.gia_nt2 || 0) *
                        (item.quantity ?? 1)
                    )
                  }}
                </small>
              </div>
            </td>
            <td class="border-0" v-if="!isShow" data-label="Hành động">
              <button
                class="btn btn-sm btn-outline-danger border-0 d-none d-md-inline-flex"
                @click="removeFromCart(item.ma_vt)"
              >
                <Trash2 :size="16" :stroke-width="1" />
              </button>
              <a
                role="button"
                class="d-inline btn-ms link-danger d-md-none"
                @click="removeFromCart(item.ma_vt)"
              >
                Xóa sản phẩm
              </a>
            </td>
          </tr>

          <tr v-for="data in findDiscountByMaVT(item.ma_vt)" class="p-md-2 p-0">
            <td colspan="5" class="border-0 px-0 px-md-2">
              <div
                class="d-flex text-primary fw-normal bg-primary bg-opacity-10 w-100 flex-column p-2 rounded"
              >
                <template v-if="data.itemNameGift?.trim()">
                  <small
                    class="text-small d-flex align-items-center gap-1 d-block"
                  >
                    <Gift :size="13" class="flex-shrink-0" /> Tặng thêm
                    {{ data.quantityGift }} sản phẩm
                    {{ data.itemNameGift }}
                  </small>
                </template>
                <template
                  v-if="data.discountType?.trim()?.toUpperCase() === 'D'"
                >
                  <small
                    class="text-small d-flex align-items-md-center align-items-sta gap-1 d-block"
                    v-if="data.discountRate"
                  >
                    <Gift :size="13" class="flex-shrink-0" /> Giảm
                    {{ data.discountRate }} % trên mỗi mặt hàng</small
                  >
                  <small
                    class="text-small d-flex align-items-center gap-1 d-block"
                    v-if="data.discountAmount"
                  >
                    <Gift :size="13" class="flex-shrink-0" /> Giảm tiền trên
                    từng mặt hàng tổng cộng
                    {{ formatCurrency(data.discountAmount) }}
                  </small>
                  <small
                    class="text-small d-flex align-items-center gap-1 d-block"
                    v-if="data.moneyVoucher"
                  >
                    <Gift :size="13" class="flex-shrink-0" />Tất cả sản phẩm
                    được đồng giá
                    {{ formatCurrency(data.moneyVoucher) }}
                  </small>
                  <small
                    class="text-small d-flex align-items-center gap-1 d-block"
                    v-if="data.totalDiscount"
                  >
                    <Gift :size="13" class="flex-shrink-0" /> Đã được giảm
                    {{ formatCurrency(data.totalDiscount) }}
                  </small>
                </template>
              </div>
            </td>
          </tr>
          <tr class="d-none d-md-table-row">
            <td colspan="5" class="bg-secondary py-0"></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
const { cart, removeFromCart } = useCart();
const { prevOrder, globalOrder } = useOrder();

const props = defineProps<{
  isShow?: boolean;
}>();
function findDiscountByMaVT(mavt: string) {
  const data = globalOrder.value.selectedDiscounts?.filter((discount: any) => {
    return discount.itemCodeBuy.trim() === mavt.trim();
  });
  return data || [];
}

function findItemInPrevOrder(mavt: string) {
  const item = prevOrder.value?.details?.find((it) => {
    return it.ma_vt?.trim() === mavt.trim();
  });
  return item;
}
</script>

<style scoped>
.text-small {
  font-size: 12px;
}
@media (max-width: 768px) {
  .card-product {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 1rem;
    background-color: #868686;
  }

  tbody tr.card-product td {
    border: 0 !important;
    padding: 0.75rem 1rem !important;
    background: transparent !important;
  }

  table.table {
    border: 0;
  }

  table.table thead {
    display: none;
  }

  table.table tbody tr {
    display: block;
    margin-bottom: 0.75rem;
    background: #efefef41;
    padding: 0.5rem 0.25rem;
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.02);
  }

  table.table tbody tr td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border: 0;
  }

  table.table tbody tr td[data-label]:before {
    content: attr(data-label);
    color: #000000;
    font-size: 13px;
    margin-right: 0.75rem;
    white-space: nowrap;
    font-weight: 600;
  }

  table.table tbody tr td:first-child {
    align-items: center;
  }

  .bg-secondary.py-0 {
    display: none;
  }
}
</style>
