<template>
  <div class="cart-summary bg-white p-4">
    <h5 class="fw-semibold mb-3">Tổng quan</h5>
    <div class="d-flex justify-content-between mb-2">
      <span>Tổng tiền hàng</span>
      <span>{{ formatCurrency(totalPrice) }}</span>

    </div>

    <ui-popover>
      <template #trigger>
        <span class="text-primary" style="cursor: pointer">
          <Gift :size="16" :stroke-width="1.75" /> Đang có 2 mã giảm giá có thể áp dụng
        </span>
      </template>
      <template #content>
        <div class="p-2" style="width: 300px">
          <strong>Mã giảm giá có thể áp dụng:</strong>
          <table class="table m-0 table-sm table-borderless mt-2 table-dark">
            <tbody>
              <tr>
                <td> <input type="radio" id="giamgia1" class="form-check" name="discout"></td>
                <td>
                  <label for="giamgia1">
                    GIAM10
                  </label>
                </td>
                <td>-10%</td>
              </tr>
              <tr>
                <td> <input type="radio" id="giamgia2" class="form-check" name="discout"></td>
                <td>
                  <label for="giamgia2">
                    QUATANG
                  </label>
                </td>
                <td>Quà tặng kèm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </ui-popover>
    <p class="mt-2"> Mã giảm giá đã áp dụng :</p>
    MAGIAMGIA1
    <hr />
    <div class="d-flex justify-content-between mb-2">
      <span>Các chương trình chiết khấu đã áp dụng :</span>
      <!-- <span> 2 khuyến mãi</span> -->
    </div>
    <div class="d-flex gap-2">

      <div class="badge px-3 border bg-info bg-opacity-10 border-info text-dark rounded-pill">
        Giảm 10%
      </div>
      <div class="badge px-3 border bg-info bg-opacity-10 border-info text-dark rounded-pill">
        Quà tặng kèm
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between  mb-3">
      <span>Tổng tiền chiết khấu</span>
      <span class="text-danger">- {{ formatCurrency(100000) }}</span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Tạm tính</span>
      <span class="text-success">{{ formatCurrency(totalPrice) }}</span>
    </div>
    <slot>
      <nuxt-link to="/checkout" class="btn text-capitalize btn-outline-success w-100">
        Thanh toán
      </nuxt-link>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useCart } from '~/composables/useCart';
  import { formatCurrency } from '~/utils';

  const { cart } = useCart();

  const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => {
      const price = Number(item.gia_nt2) || 0;
      const qty = Number(item.quantity) || 1;
      return total + price * qty;
    }, 0);
  });
</script>

<style></style>
